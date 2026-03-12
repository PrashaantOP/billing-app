// ──────────────────────────────────────────────────────────────
//  Shared print utilities
//  Both functions receive the order, printSettings, and
//  currentRestaurant from Inertia shared props.
// ──────────────────────────────────────────────────────────────

function baseFontPx(fontSizeSetting: string | undefined): number {
    if (fontSizeSetting === 'small') return 10;
    if (fontSizeSetting === 'large') return 14;
    return 12; // medium
}

function paperWidthPx(paperSize: string | undefined): string {
    if (paperSize === '58mm') return '220px';
    if (paperSize === '80mm') return '302px';
    return '302px'; // fallback for thermal
}

function logoTag(restaurant: any, settings: any): string {
    if (!settings?.show_logo || !restaurant?.logo) return '';
    const url = `${window.location.origin}/assets/images/logos/${restaurant.logo}`;
    return `<img src="${url}" alt="Logo" style="display:block;margin:0 auto 6px;max-width:90px;max-height:70px;object-fit:contain;" />`;
}

// ── KOT ────────────────────────────────────────────────────────
export function printKOT(order: any, settings: any, restaurant: any): void {
    const px   = baseFontPx(settings?.font_size);
    const w    = paperWidthPx(settings?.paper_size);
    const showCustomer  = settings?.show_customer_info !== false;
    const showOrderType = settings?.show_order_type !== false;

    const items = (order.items || [])
        .map((item: any) => `
            <tr>
              <td style="padding:4px 6px;text-align:left">${item.menu_item?.name || item.name || '-'}</td>
              <td style="padding:4px 6px;text-align:center;font-weight:bold">${item.quantity}</td>
            </tr>`)
        .join('');

    const win = window.open('', '_blank', 'width=420,height=700');
    if (!win) { alert('Pop-up blocked. Please allow pop-ups for printing.'); return; }

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>KOT #${order.order_number}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Courier New',Courier,monospace; font-size:${px}px; width:${w}; max-width:100%; padding:12px; }
    h1  { text-align:center; font-size:${px + 4}px; font-weight:bold; margin-bottom:2px; }
    h2  { text-align:center; font-size:${px + 2}px; font-weight:bold; margin:4px 0; }
    .sub  { text-align:center; font-size:${px - 1}px; color:#555; }
    .divider { border-top:1px dashed #000; margin:7px 0; }
    .row { display:flex; justify-content:space-between; margin:3px 0; font-size:${px}px; }
    table { width:100%; border-collapse:collapse; }
    th { border-bottom:1px solid #000; padding:4px 6px; text-align:left; font-size:${px - 1}px; text-transform:uppercase; }
    th:last-child { text-align:center; }
    .footer { text-align:center; margin-top:10px; font-size:${px - 1}px; color:#777; }
    @media print { body { margin:0; } }
  </style>
</head>
<body>
  ${logoTag(restaurant, settings)}
  <h1>${restaurant?.name || 'Restaurant'}</h1>
  ${restaurant?.address ? `<div class="sub">${restaurant.address}</div>` : ''}
  ${restaurant?.phone   ? `<div class="sub">Tel: ${restaurant.phone}</div>` : ''}
  ${restaurant?.gst_no  ? `<div class="sub">GST: ${restaurant.gst_no}</div>` : ''}
  ${settings?.header_text ? `<div class="sub" style="margin-top:4px">${settings.header_text}</div>` : ''}
  <div class="divider"></div>
  <h2>&#9733; KOT &#9733;</h2>
  <div class="sub">Kitchen Order Ticket</div>
  <div class="divider"></div>
  <div class="row"><span><b>Order #</b></span><span>${order.order_number}</span></div>
  ${showOrderType ? `<div class="row"><span><b>Type</b></span><span style="text-transform:capitalize">${order.order_type || ''}</span></div>` : ''}
  ${order.dining_table?.name ? `<div class="row"><span><b>Table</b></span><span>${order.dining_table.name}</span></div>` : ''}
  ${showCustomer && order.customer?.name ? `<div class="row"><span><b>Customer</b></span><span>${order.customer.name}</span></div>` : ''}
  <div class="row"><span><b>Date &amp; Time</b></span><span>${new Date(order.created_at).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</span></div>
  <div class="divider"></div>
  <table>
    <thead><tr><th>Item</th><th style="text-align:center">Qty</th></tr></thead>
    <tbody>${items}</tbody>
  </table>
  <div class="divider"></div>
  <div class="footer">${settings?.footer_text || '--- End of KOT ---'}</div>
</body>
</html>`);

    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 400);
}

// ── BILL ───────────────────────────────────────────────────────
export function printBill(order: any, settings: any, restaurant: any): void {
    const isThermal = ['58mm', '80mm'].includes(settings?.paper_size ?? '80mm');

    if (isThermal) {
        printThermalBill(order, settings, restaurant);
    } else {
        printA4Bill(order, settings, restaurant);
    }
}

// ── Thermal Bill (58 mm / 80 mm) ───────────────────────────────
function printThermalBill(order: any, settings: any, restaurant: any): void {
    const px  = baseFontPx(settings?.font_size);
    const w   = paperWidthPx(settings?.paper_size);
    const showCustomer  = settings?.show_customer_info !== false;
    const showOrderType = settings?.show_order_type !== false;
    const showTax       = settings?.show_tax_details !== false;

    const subtotal = Number(order.subtotal || 0);
    const discount = Number(order.discount || 0);
    const tax      = Number(order.tax      || 0);
    const total    = Number(order.total    || 0);

    const items = (order.items || [])
        .map((item: any) => {
            const price = Number(item.price    || 0);
            const qty   = Number(item.quantity || 1);
            return `<tr>
              <td style="padding:3px 5px">${item.menu_item?.name || item.name || '-'}</td>
              <td style="padding:3px 5px;text-align:center">${qty}</td>
              <td style="padding:3px 5px;text-align:right">₹${price.toFixed(2)}</td>
              <td style="padding:3px 5px;text-align:right">₹${(price * qty).toFixed(2)}</td>
            </tr>`;
        })
        .join('');

    const win = window.open('', '_blank', 'width=420,height=700');
    if (!win) { alert('Pop-up blocked. Please allow pop-ups for printing.'); return; }

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Bill #${order.order_number}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Courier New',Courier,monospace; font-size:${px}px; width:${w}; max-width:100%; padding:12px; }
    h1  { text-align:center; font-size:${px + 4}px; font-weight:bold; margin-bottom:2px; }
    .center { text-align:center; }
    .sub    { text-align:center; font-size:${px - 1}px; color:#555; }
    .divider { border-top:1px dashed #000; margin:7px 0; }
    .row { display:flex; justify-content:space-between; margin:3px 0; }
    .bold { font-weight:bold; }
    table { width:100%; border-collapse:collapse; }
    th { border-bottom:1px solid #000; padding:3px 5px; text-align:left; font-size:${px - 1}px; text-transform:uppercase; }
    th.r,td.r { text-align:right; }
    th.c,td.c { text-align:center; }
    .footer { text-align:center; margin-top:10px; font-size:${px - 1}px; color:#777; }
    @media print { body { margin:0; } }
  </style>
</head>
<body>
  ${logoTag(restaurant, settings)}
  <h1>${restaurant?.name || 'Restaurant'}</h1>
  ${restaurant?.address ? `<div class="sub">${restaurant.address}</div>` : ''}
  ${restaurant?.phone   ? `<div class="sub">Tel: ${restaurant.phone}</div>` : ''}
  ${restaurant?.gst_no  ? `<div class="sub">GST: ${restaurant.gst_no}</div>` : ''}
  ${settings?.header_text ? `<div class="sub" style="margin-top:4px">${settings.header_text}</div>` : ''}
  <div class="divider"></div>
  <div class="center bold">TAX INVOICE</div>
  <div class="divider"></div>
  <div class="row"><span><b>Bill #</b></span><span>${order.order_number}</span></div>
  <div class="row"><span><b>Date</b></span><span>${new Date(order.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span></div>
  <div class="row"><span><b>Time</b></span><span>${new Date(order.created_at).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</span></div>
  ${showCustomer && order.customer?.name  ? `<div class="row"><span><b>Customer</b></span><span>${order.customer.name}</span></div>`  : ''}
  ${showCustomer && order.customer?.phone ? `<div class="row"><span><b>Phone</b></span><span>${order.customer.phone}</span></div>` : ''}
  ${showOrderType ? `<div class="row"><span><b>Order Type</b></span><span style="text-transform:capitalize">${order.order_type || ''}</span></div>` : ''}
  ${order.dining_table?.name ? `<div class="row"><span><b>Table</b></span><span>${order.dining_table.name}</span></div>` : ''}
  <div class="divider"></div>
  <table>
    <thead>
      <tr><th>Item</th><th class="c">Qty</th><th class="r">Rate</th><th class="r">Amt</th></tr>
    </thead>
    <tbody>${items}</tbody>
  </table>
  <div class="divider"></div>
  <div class="row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
  ${discount > 0 ? `<div class="row"><span>Discount</span><span>- ₹${discount.toFixed(2)}</span></div>` : ''}
  ${showTax && tax > 0 ? `<div class="row"><span>Tax</span><span>₹${tax.toFixed(2)}</span></div>` : ''}
  <div class="divider"></div>
  <div class="row bold"><span>TOTAL</span><span>₹${total.toFixed(2)}</span></div>
  <div class="row"><span>Payment</span><span style="text-transform:capitalize">${order.payment_status || ''}</span></div>
  <div class="divider"></div>
  <div class="footer">${settings?.footer_text || 'Thank you! Visit again.'}</div>
</body>
</html>`);

    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 400);
}

// ── A4 / A5 Bill ───────────────────────────────────────────────
function printA4Bill(order: any, settings: any, restaurant: any): void {
    const showCustomer  = settings?.show_customer_info !== false;
    const showOrderType = settings?.show_order_type !== false;
    const showTax       = settings?.show_tax_details !== false;

    const subtotal = Number(order.subtotal || 0);
    const discount = Number(order.discount || 0);
    const tax      = Number(order.tax      || 0);
    const total    = Number(order.total    || 0);

    const logo = (settings?.show_logo && restaurant?.logo)
        ? `<img src="${window.location.origin}/assets/images/logos/${restaurant.logo}" alt="Logo" style="max-width:80px;max-height:70px;object-fit:contain;" />`
        : '';

    const pageSize = settings?.paper_size === 'A5' ? 'A5 landscape' : 'A4';

    const items = (order.items || [])
        .map((item: any) => {
            const price = Number(item.price    || 0);
            const qty   = Number(item.quantity || 1);
            return `<tr>
              <td>${item.menu_item?.name || item.name || '-'}</td>
              <td class="c">${qty}</td>
              <td class="r">₹${price.toFixed(2)}</td>
              <td class="r"><b>₹${(price * qty).toFixed(2)}</b></td>
            </tr>`;
        })
        .join('');

    const win = window.open('', '_blank', 'width=820,height=1100');
    if (!win) { alert('Pop-up blocked. Please allow pop-ups for printing.'); return; }

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Invoice #${order.order_number}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    @page { size:${pageSize}; margin:20mm; }
    body { font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#111; padding:30px; max-width:760px; margin:0 auto; }
    /* Header */
    .top { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:20px; border-bottom:2px solid #e5e7eb; margin-bottom:24px; }
    .brand { display:flex; align-items:center; gap:14px; }
    .rest-name { font-size:22px; font-weight:800; color:#111; margin-bottom:4px; }
    .rest-info { font-size:11px; color:#666; line-height:1.7; }
    .inv-title h2 { font-size:28px; font-weight:800; color:#dc2626; letter-spacing:1px; text-align:right; }
    .inv-title p  { font-size:12px; color:#666; text-align:right; margin-top:3px; }
    /* Info boxes */
    .info-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
    .info-box { background:#f9fafb; border-radius:8px; padding:14px; }
    .info-box h4 { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#9ca3af; margin-bottom:8px; }
    .info-box p  { font-size:13px; margin-bottom:2px; }
    .info-box .muted { font-size:11px; color:#6b7280; }
    /* Table */
    table { width:100%; border-collapse:collapse; margin-bottom:20px; }
    thead { background:#111; }
    thead th { color:#fff; padding:10px 14px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; }
    tbody tr:nth-child(even) { background:#f9fafb; }
    tbody td { padding:10px 14px; border-bottom:1px solid #f3f4f6; font-size:13px; }
    th.r,td.r { text-align:right; }
    th.c,td.c { text-align:center; }
    /* Totals */
    .totals-wrap { display:flex; justify-content:flex-end; margin-bottom:30px; }
    .totals { border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; min-width:260px; }
    .totals tr td { padding:9px 16px; font-size:13px; border-bottom:1px solid #f3f4f6; }
    .totals tr:last-child td { background:#111; color:#fff; font-size:15px; font-weight:700; border-bottom:none; }
    /* Badge */
    .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; }
    .paid    { background:#dcfce7; color:#16a34a; }
    .pending { background:#fef9c3; color:#ca8a04; }
    .partial { background:#fed7aa; color:#ea580c; }
    /* Footer */
    .footer { text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb; padding-top:16px; }
    @media print { body { padding:0; } }
  </style>
</head>
<body>
  <div class="top">
    <div class="brand">
      ${logo}
      <div>
        <div class="rest-name">${restaurant?.name || 'Restaurant'}</div>
        <div class="rest-info">
          ${restaurant?.address ? `${restaurant.address}<br>` : ''}
          ${restaurant?.phone   ? `Tel: ${restaurant.phone}<br>` : ''}
          ${restaurant?.gst_no  ? `GST No: ${restaurant.gst_no}` : ''}
        </div>
      </div>
    </div>
    <div class="inv-title">
      <h2>TAX INVOICE</h2>
      <p>Invoice #: ${order.order_number}</p>
      <p>Date: ${new Date(order.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}</p>
      <p>Time: ${new Date(order.created_at).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</p>
    </div>
  </div>

  <div class="info-row">
    ${showCustomer ? `
    <div class="info-box">
      <h4>Bill To</h4>
      <p>${order.customer?.name || 'Walk-in Customer'}</p>
      ${order.customer?.phone ? `<p class="muted">${order.customer.phone}</p>` : ''}
    </div>` : '<div></div>'}
    <div class="info-box">
      <h4>Order Details</h4>
      ${showOrderType ? `<p style="text-transform:capitalize">Type: ${order.order_type || ''}</p>` : ''}
      ${order.dining_table?.name ? `<p>Table: ${order.dining_table.name}</p>` : ''}
      <p>Payment: <span class="badge ${order.payment_status}">${order.payment_status || ''}</span></p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th class="c">Qty</th>
        <th class="r">Rate</th>
        <th class="r">Amount</th>
      </tr>
    </thead>
    <tbody>${items}</tbody>
  </table>

  <div class="totals-wrap">
    <table class="totals">
      <tr><td>Subtotal</td><td class="r">₹${subtotal.toFixed(2)}</td></tr>
      ${discount > 0 ? `<tr><td>Discount</td><td class="r" style="color:#dc2626">− ₹${discount.toFixed(2)}</td></tr>` : ''}
      ${showTax && tax > 0 ? `<tr><td>Tax</td><td class="r">₹${tax.toFixed(2)}</td></tr>` : ''}
      <tr><td>Total</td><td class="r">₹${total.toFixed(2)}</td></tr>
    </table>
  </div>

  <div class="footer">${settings?.footer_text || 'Thank you for your visit! Please come again.'}</div>
</body>
</html>`);

    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
}
