import sys
import json
import numpy as np
import pandas as pd

rng_seed = 2026
DAYS = 365

def nb_params(m, v):
    v = max(v, m + 0.01)
    p = m / v
    r = m * p / (1 - p)
    return r, p

def gen_demand(rng, reps, days, scale, share, price, cfg):
    lam_t = cfg['lam_t']
    var_t = cfg['var_t']
    rev_mean = cfg['rev_mean']

    r, p = nb_params(lam_t * scale, var_t * scale)
    tick = rng.negative_binomial(r, p, size=(reps, days))
    mean_units_day = max(0.01, (rev_mean * scale * share) / max(price, 1.0))
    q = 1.25 if price <= 150 else 1.0
    pinc = min(0.95, mean_units_day / max(lam_t * scale * q, 0.01))
    k = rng.binomial(tick, pinc)
    extra = rng.binomial(k, (q - 1.0)) if q > 1 else 0
    return k + extra, mean_units_day

def gen_lt(rng, shape, plocal, lt_mult, cfg):
    loc = rng.random(shape) < plocal
    paq = rng.triangular(*cfg['lt_paq'], size=shape) * lt_mult
    return np.where(loc, cfg['lt_local'], np.ceil(paq)).astype(int)

def simulate(policy, params, D, LT, cost, price, h_rate, k_order, reps, days, T=7, return_trace=False):
    maxlt = int(LT.max()) + 2
    onhand = np.full(reps, float(params['R'] if policy == 'QR' else params['S']))
    pipe = np.zeros((reps, maxlt + days + 2))
    sold = np.zeros(reps); dem = np.zeros(reps); orders = np.zeros(reps)
    inv_sum = np.zeros(reps); so_days = np.zeros(reps)
    trace = []

    for t in range(days):
        onhand += pipe[:, t]
        d = D[:, t]
        s = np.minimum(onhand, d)
        onhand -= s; sold += s; dem += d; so_days += (d > s)
        inv_sum += onhand
        if return_trace and t < 120:
            trace.append(int(onhand[0]))
        pos = onhand + pipe[:, t + 1:].sum(1)

        if policy == 'QR':
            mask = pos <= params['R']
            qty = np.where(mask, params['Q'], 0.0)
            need = np.where(mask, np.ceil(np.maximum(params['R'] - pos + 1, 0) / max(params['Q'], 1)) * params['Q'], 0.0)
            qty = np.maximum(qty, need)
        else:
            qty = np.maximum(params['S'] - pos, 0.0) if (t % T == 0) else np.zeros(reps)

        m = qty > 0
        if m.any():
            idx = np.where(m)[0]
            arr = t + 1 + LT[idx, t]
            pipe[idx, arr] += qty[idx]
            orders += m

    fill = sold / np.maximum(dem, 1)
    avg_inv = inv_sum / days
    hold = avg_inv * cost * h_rate * days / 365
    ordc = orders * k_order
    lost = (dem - sold) * max(price - cost, 0.0)
    total = hold + ordc + lost

    metrics = dict(
        fill=float(fill.mean()), fill_p5=float(np.percentile(fill, 5)),
        so_days=float(so_days.mean()), orders=float(orders.mean()),
        avg_inv=float(avg_inv.mean()), inv_cap=float((avg_inv * cost).mean()),
        hold=float(hold.mean()), ordc=float(ordc.mean()),
        lost=float(lost.mean()), total=float(total.mean()),
        p_stockout=float((so_days > 0).mean())
    )
    return (metrics, trace) if return_trace else metrics

def run(productos, cfg, scale=1.0, plocal_mult=1.0, lt_mult=1.0, reps=300, seed=rng_seed, fixed=None, capture_trace=False):
    out = []; chosen = {}; daily_trace = []
    h_rate = cfg['h_rate']
    k_order = cfg['k_order']
    iva_mult = (1.0 + cfg['iva']) if cfg.get('incluir_iva', True) else 1.0

    for i, prod in enumerate(productos):
        nm = prod['nombre']
        cl = prod['clase']
        share = float(prod['share'])
        price = float(prod['precio']) * iva_mult
        cost = float(prod['costo']) * iva_mult
        pl = float(prod['plocal'])

        rng = np.random.default_rng(seed + i)
        D, mu = gen_demand(rng, reps, DAYS, scale, share, price, cfg)
        plocal = min(1.0, pl * plocal_mult)
        LT = gen_lt(rng, (reps, DAYS), plocal, lt_mult, cfg)
        target = 0.95 if cl == 'A' else (0.90 if cl == 'B' else 0.85)
        lt_paq_mean = float(np.mean(cfg['lt_paq']))
        lt_avg = plocal * cfg['lt_local'] + (1 - plocal) * lt_paq_mean
        lt_max = cfg['lt_paq'][2] if plocal < 1 else cfg['lt_local']
        dmax = float(np.ceil(cfg['rev_max'] * share / max(price, 1.0)))
        ss_doc = float(max(0, dmax * lt_max - mu * lt_avg))
        rop_doc = float(mu * lt_avg + ss_doc)
        eoq = int(max(1, round(np.sqrt(2 * k_order * mu * 365 / max(cost * h_rate, 0.01)))))
        res = {}

        if fixed is None:
            best = None
            Rs = np.arange(0, int(rop_doc * 1.6) + 6)
            Qs = sorted(set([max(1, eoq // 2), max(1, eoq), eoq * 2, max(1, int(mu * 7)), max(1, int(mu * 14)), max(1, int(mu * 30))]))
            for Q in Qs:
                for R in Rs:
                    r = simulate('QR', dict(R=int(R), Q=int(Q)), D, LT, cost, price, h_rate, k_order, reps, DAYS)
                    ok = r['fill'] >= target
                    key = (not ok, r['total'])
                    if best is None or key < best[0]:
                        best = (key, dict(R=int(R), Q=int(Q)), r)
            res['QR'] = best

            for T in (7, 14, 30):
                best = None
                for S in range(1, int(mu * (T + lt_max) * 2.2) + 8):
                    r = simulate('P', dict(S=int(S), T=T), D, LT, cost, price, h_rate, k_order, reps, DAYS, T=T)
                    ok = r['fill'] >= target
                    key = (not ok, r['total'])
                    if best is None or key < best[0]:
                        best = (key, dict(S=int(S), T=T), r)
                res[f'P{T}'] = best
            chosen[nm] = {k: v[1] for k, v in res.items()}
        else:
            for k, pp in fixed[nm].items():
                pol = 'QR' if k == 'QR' else 'P'
                r = simulate(pol, pp, D, LT, cost, price, h_rate, k_order, reps, DAYS, T=pp.get('T', 7))
                res[k] = (None, pp, r)

        if capture_trace and i == 0:
            _, tr_qr = simulate('QR', res['QR'][1], D, LT, cost, price, h_rate, k_order, reps, DAYS, return_trace=True)
            _, tr_p30 = simulate('P', res['P30'][1], D, LT, cost, price, h_rate, k_order, reps, DAYS, T=30, return_trace=True)
            daily_trace = [
                {"dia": d + 1, "QR": tr_qr[d], "Mensual": tr_p30[d], "ROP": res['QR'][1]['R']}
                for d in range(len(tr_qr))
            ]

        pol_map = {'QR': '(Q,R)', 'P7': 'Periódica semanal', 'P14': 'Periódica quincenal', 'P30': 'Periódica mensual'}
        for k, (_, pp, r) in res.items():
            out.append(dict(
                Producto=nm, Clase=cl, Politica=pol_map[k], Param=json.dumps(pp),
                mu=float(mu), lt_avg=float(lt_avg), dmax=dmax, ss_doc=ss_doc, rop_doc=rop_doc, eoq=eoq, **r
            ))
    return pd.DataFrame(out), chosen, daily_trace

def project_12_months(scale, inflacion_anual, crecimiento_mensual, cfg):
    iva_mult = (1.0 + cfg['iva']) if cfg.get('incluir_iva', True) else 1.0
    venta_mensual_base = cfg['rev_mean'] * 30.4 * scale * iva_mult
    pi_base = (1 + inflacion_anual) ** (1/12) - 1
    pi_pes = (1 + 0.05) ** (1/12) - 1
    pi_opt = (1 + 0.03) ** (1/12) - 1

    proj = []
    for m in range(1, 13):
        proj.append({
            "mes": f"Mes {m}",
            "Pesimista": round((venta_mensual_base * 0.8) * ((1 + pi_pes) ** m)),
            "Base": round(venta_mensual_base * ((1 + crecimiento_mensual) ** m) * ((1 + pi_base) ** m)),
            "Optimista": round((venta_mensual_base * 1.2) * ((1 + 0.02) ** m) * ((1 + pi_opt) ** m))
        })
    return proj

if __name__ == '__main__':
    raw_input = sys.stdin.read().strip()
    args = json.loads(raw_input) if raw_input else {}

    scale = float(args.get('scale', 1.0))
    plocal_mult = float(args.get('plocal_mult', 1.0))
    lt_mult = float(args.get('lt_mult', 1.0))
    inflacion_anual = float(args.get('inflacion_anual', 0.0375))
    crecimiento_mensual = float(args.get('crecimiento_mensual', 0.01))
    reps = int(args.get('reps', 300))
    cfg = args['config']
    productos = args['productos']

    base, chosen, daily_trace = run(productos, cfg, scale, plocal_mult, lt_mult, reps=reps, capture_trace=True)
    base['Escenario'] = 'Base'

    pes, _, _ = run(productos, cfg, 0.8 * scale, 0.6 * plocal_mult, 1.3 * lt_mult, reps=reps, fixed=chosen, seed=777)
    pes['Escenario'] = 'Pesimista'

    opt, _, _ = run(productos, cfg, 1.2 * scale, plocal_mult, lt_mult, reps=reps, fixed=chosen, seed=888)
    opt['Escenario'] = 'Optimista'

    allr = pd.concat([base, pes, opt])
    proyeccion = project_12_months(scale, inflacion_anual, crecimiento_mensual, cfg)

    print(json.dumps({
        "chosen": chosen,
        "results": allr.to_dict(orient='records'),
        "proyeccion12Meses": proyeccion,
        "trayectoriaDiaria": daily_trace
    }))