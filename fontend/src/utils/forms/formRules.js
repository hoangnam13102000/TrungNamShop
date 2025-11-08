export const brandRules = {
  name: {
    required: true,
    minLength: 2,
    message: "Tên thương hiệu ít nhất 2 ký tự",
  },
  file: {
    required: true,
    message: "Vui lòng chọn hình ảnh",
  },
};

export const productRules = {
  name: {
    required: true,
    minLength: 2,
    message: "Tên sản phẩm phải có ít nhất 2 ký tự",
  },
  price: {
    required: true,
    message: "Vui lòng nhập giá sản phẩm",
  },
  brand: {
    required: true,
    message: "Vui lòng chọn thương hiệu",
  },
  file: {
    required: true,
    message: "Vui lòng chọn hình ảnh sản phẩm",
  },
};
