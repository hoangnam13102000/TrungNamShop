export const getProductDetailFormFields = ({
  products = [],
  screens = [],
  rearCameras = [],
  frontCameras = [],
  memories = [],
  operatingSystems = [],
  batteries = [],
  utilities = [],
  connectivities = [],
  generalInfos = [],
}) => {
  const safeEntries = (obj) => (obj ? Object.entries(obj) : []);

  return [
    {
      section: "Thông tin chung",
      fields: [
        {
          name: "product_id",
          label: "Sản phẩm",
          type: "select",
          required: true,
          options: products.map((p) => ({ label: p.name, value: p.id })),
        },
        {
          name: "general_information_id",
          label: "Thông tin chung",
          type: "select",
          options: generalInfos.filter(Boolean).map((g) => ({
            label: Object.values(g).filter((v) => v != null && v !== "").join(" | "),
            value: g.id,
          })),
        },
      ],
    },
    {
      section: "Màn hình",
      fields: [
        {
          name: "screen_id",
          label: "Màn hình",
          type: "select",
          options: screens.filter(Boolean).map((s) => ({
            label: safeEntries(s).filter(([k]) => k !== "id").map(([k, v]) => `${k}: ${v}`).join(" | "),
            value: s.id,
          })),
        },
      ],
    },
    {
      section: "Camera",
      fields: [
        {
          name: "rear_camera_id",
          label: "Camera sau",
          type: "select",
          options: rearCameras.filter(Boolean).map((c) => ({
            label: safeEntries(c).filter(([k]) => k !== "id").map(([k, v]) => `${k}: ${v}`).join(" | "),
            value: c.id,
          })),
        },
        {
          name: "front_camera_id",
          label: "Camera trước",
          type: "select",
          options: frontCameras.filter(Boolean).map((c) => ({
            label: safeEntries(c).filter(([k]) => k !== "id").map(([k, v]) => `${k}: ${v}`).join(" | "),
            value: c.id,
          })),
        },
      ],
    },
    {
      section: "Bộ nhớ",
      fields: [
        {
          name: "memory_id",
          label: "Bộ nhớ (RAM / ROM)",
          type: "select",
          options: memories.filter(Boolean).map((m) => ({
            label: safeEntries(m).filter(([k]) => k !== "id").map(([k, v]) => `${k}: ${v}`).join(" | "),
            value: m.id,
          })),
        },
      ],
    },
    {
      section: "Pin & Hệ điều hành",
      fields: [
        {
          name: "operating_system_id",
          label: "Hệ điều hành",
          type: "select",
          options: operatingSystems.filter(Boolean).map((os) => ({
            label: safeEntries(os).filter(([k]) => k !== "id").map(([k, v]) => `${k}: ${v}`).join(" | "),
            value: os.id,
          })),
        },
        {
          name: "battery_charging_id",
          label: "Pin / Sạc",
          type: "select",
          options: batteries.filter(Boolean).map((b) => ({
            label: safeEntries(b).filter(([k]) => k !== "id").map(([k, v]) => `${k}: ${v}`).join(" | "),
            value: b.id,
          })),
        },
      ],
    },
    {
      section: "Tiện ích & Kết nối",
      fields: [
        {
          name: "utility_id",
          label: "Tiện ích",
          type: "select",
          options: utilities.filter(Boolean).map((u) => ({
            label: safeEntries(u).filter(([k]) => k !== "id").map(([k, v]) => `${k}: ${v}`).join(" | "),
            value: u.id,
          })),
        },
        {
          name: "communication_connectivity_id",
          label: "Kết nối & SIM",
          type: "select",
          options: connectivities.filter(Boolean).map((c) => ({
            label: safeEntries(c).filter(([k]) => k !== "id").map(([k, v]) => `${k}: ${v}`).join(" | "),
            value: c.id,
          })),
        },
      ],
    },
    {
      section: "💰 Giá & Tồn kho",
      fields: [
        { name: "price", label: "Giá bán (₫)", type: "number", min: 0, step: 1000 },
        { name: "stock_quantity", label: "Số lượng tồn kho", type: "number", min: 0, step: 1 },
      ],
    },
  ];
};
