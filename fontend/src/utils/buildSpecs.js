export const buildSpecs = (data) => {
  if (!data) return [];

  const specs = [];

  if (data.product) {
    specs.push({
      category: "Thông tin sản phẩm",
      details: [
        { label: "Tên sản phẩm", value: data.product?.name },
        { label: "Mã sản phẩm", value: data.product?.code },
        { label: "Thương hiệu", value: data.product?.brand?.name },
        { label: "Danh mục", value: data.product?.category?.name },
        { label: "Mô tả", value: data.product?.description },
      ].filter((d) => d.value),
    });
  }

  if (data.general_information) {
    specs.push({
      category: "Thông tin chung",
      details: [
        { label: "Thiết kế", value: data.general_information.design },
        { label: "Chất liệu", value: data.general_information.material },
        { label: "Kích thước", value: data.general_information.dimensions },
        { label: "Khối lượng", value: data.general_information.weight },
        { label: "Ngày ra mắt", value: data.general_information.launch_time },
      ],
    });
  }

  if (data.screen) {
    specs.push({
      category: "Màn hình",
      details: [
        { label: "Công nghệ hiển thị", value: data.screen.display_technology },
        { label: "Độ phân giải", value: data.screen.resolution },
        { label: "Kích thước màn hình", value: data.screen.screen_size },
        { label: "Độ sáng tối đa", value: data.screen.max_brightness },
        { label: "Kính bảo vệ", value: data.screen.glass_protection },
      ],
    });
  }

  if (data.rear_camera) {
    specs.push({
      category: "Camera sau",
      details: [
        { label: "Độ phân giải", value: data.rear_camera.resolution },
        { label: "Khẩu độ", value: data.rear_camera.aperture },
        { label: "Quay video", value: data.rear_camera.video_capability },
        { label: "Tính năng", value: data.rear_camera.features },
      ],
    });
  }

  if (data.front_camera) {
    specs.push({
      category: "Camera trước",
      details: [
        { label: "Độ phân giải", value: data.front_camera.resolution },
        { label: "Khẩu độ", value: data.front_camera.aperture },
        { label: "Quay video", value: data.front_camera.video_capability },
        { label: "Tính năng", value: data.front_camera.features },
      ],
    });
  }

  if (data.memory) {
    specs.push({
      category: "Bộ nhớ",
      details: [
        { label: "RAM", value: data.memory.ram },
        { label: "Bộ nhớ trong", value: data.memory.internal_storage },
        { label: "Khe thẻ nhớ", value: data.memory.memory_card_slot },
      ],
    });
  }

  if (data.operating_system) {
    specs.push({
      category: "Hệ điều hành",
      details: [
        { label: "Hệ điều hành", value: data.operating_system.name },
        { label: "Bộ xử lý", value: data.operating_system.processor },
        { label: "Tốc độ CPU", value: data.operating_system.cpu_speed },
        { label: "GPU", value: data.operating_system.gpu },
      ],
    });
  }

  if (data.battery_charging) {
    specs.push({
      category: "Pin & Sạc",
      details: [
        { label: "Dung lượng pin", value: data.battery_charging.battery_capacity },
        { label: "Cổng sạc", value: data.battery_charging.charging_port },
        { label: "Công nghệ sạc", value: data.battery_charging.charging },
      ],
    });
  }

  if (data.utility) {
    specs.push({
      category: "Tiện ích",
      details: [
        { label: "Bảo mật nâng cao", value: data.utility.advanced_security },
        { label: "Tính năng đặc biệt", value: data.utility.special_features },
        { label: "Chống nước / bụi", value: data.utility.water_dust_resistance },
      ],
    });
  }

  if (data.communication_connectivity) {
    specs.push({
      category: "Kết nối & Giao tiếp",
      details: [
        { label: "NFC", value: data.communication_connectivity.nfc },
        { label: "Khe SIM", value: data.communication_connectivity.sim_slot },
        { label: "Mạng di động", value: data.communication_connectivity.mobile_network },
        { label: "Định vị GPS", value: data.communication_connectivity.gps },
      ],
    });
  }

  return specs;
};
 