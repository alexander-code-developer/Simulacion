import { BrevoClient } from '@getbrevo/brevo';

export const sendLowStockAlert = async (product, config) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!apiKey || apiKey.includes('tu-clave-api') || !senderEmail || !ownerEmail) {
    console.log(`⚠️ [Aviso Local] Stock bajo en ${product.nombre}: Pedir ${product.qOptimo} u.`);
    return { sent: false, reason: 'Falta BREVO_API_KEY en .env' };
  }

  try {
    const client = new BrevoClient({ apiKey });

    const tiempoEntrega = product.probLocal >= 0.5
      ? `${config?.ltLocal ?? 1} día (Almacén Local Auto Todo)`
      : `${config?.ltPaqMin ?? 4} a ${config?.ltPaqMax ?? 10.5} días (Paquetería Estafeta)`;

    const ivaMult = config?.incluirIvaEnPrecios ? (1 + (config?.iva ?? 0.16)) : 1;
    const costoPedidoEstimado = Math.round(product.qOptimo * product.costoUnitario * ivaMult);

    const data = await client.transactionalEmails.sendTransacEmail({
      subject: `🚨 ALERTA DE INVENTARIO: Pedir ${product.qOptimo} u. de ${product.nombre}`,
      sender: {
        name: 'Refaccionaria Actopan',
        email: senderEmail
      },
      to: [{ email: ownerEmail, name: 'Dueño Refaccionaria' }],
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
          <div style="background:#b91c1c;color:white;padding:18px 24px;">
            <h2 style="margin:0;font-size:18px;">⚠️ Punto de Reorden Alcanzado</h2>
            <p style="margin:4px 0 0;font-size:13px;opacity:0.9;">Refaccionaria Automotriz Actopan · Control (Q,R)</p>
          </div>
          <div style="padding:24px;color:#1e293b;line-height:1.5;">
            <p>El inventario de <strong>${product.nombre} (Clase ${product.clase})</strong> llegó a su límite crítico.</p>
            <div style="background:#f8fafc;border-left:4px solid #162b4d;padding:14px;margin:16px 0;">
              <p style="margin:0 0 6px;"><strong>Existencias actuales en bodega:</strong> ${product.stockActual} piezas</p>
              <p style="margin:0 0 6px;"><strong>Punto de reorden configurado (R):</strong> ${product.ropOptimo} piezas</p>
              <p style="margin:0;color:#047857;font-size:15px;"><strong>👉 Acción recomendada: Pedir ${product.qOptimo} piezas a Auto Todo</strong></p>
            </div>
            <p style="font-size:13px;color:#475569;">
              • <strong>Inversión estimada del pedido:</strong> $${costoPedidoEstimado.toLocaleString()} MXN<br/>
              • <strong>Tiempo de entrega esperado:</strong> ${tiempoEntrega}
            </p>
          </div>
        </div>
      `
    });

    console.log(`📧 Correo enviado por API de Brevo para ${product.nombre}`);
    return { sent: true, data };
  } catch (error) {
    console.error('❌ Error API Brevo:', error.message);
    return { sent: false, reason: error.message };
  }
};