export const formatInitialData = (item) => {
  if (!item) return {};
  const toNumber = (val) => (val !== null && val !== undefined ? Number(val) : null);
  const formatDate = (dateStr) => (dateStr ? dateStr.split(" ")[0] : "");
  return {
    ...item,
    customer_id: toNumber(item.customer?.id || item.customer_id),
    employee_id: toNumber(item.employee?.id || item.employee_id),
    discount_id: toNumber(item.discount?.id || item.discount_id),
    store_id: toNumber(item.store?.id || item.store_id),
    delivery_date: formatDate(item.delivery_date),
    order_date: formatDate(item.order_date),
    order_status: item.order_status,
    payment_status: item.payment_status,
    delivery_method: item.delivery_method,
    payment_method: item.payment_method,
  };
};

export const mapOptions = (list, labelKey = "name") =>
  list && list.length ? list.map((i) => ({ value: Number(i.id), label: i[labelKey] || "—" })) : [];

export const addPlaceholder = (options, placeholder) =>
  options.length ? options : [{ value: null, label: placeholder }];
