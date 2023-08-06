import ProductModel from "../models/product.model.js"

class ProductsDAO {
  async getAllProd(page, limit, sort, query) {
    try {
        const filter = query
        ? { title: { $regex: query.title, $options: "i" } }
        : {};
        const products = await ProductModel.paginate(filter, {
            limit: limit || 5,
            page: page || 1,
            sort: sort === "desc" ? "-price" : "price",
            lean: true,
          });
        return products;
    } catch (error) {
        throw error;
    }
    }
  async createOneProduct(){
    const product = ProductModel.create();
    return product;
  };
  async deleteOneProduct(){
    const product = ProductModel.deleteOne();
    return product;
  };
  async updateOneProduct(){
    const product = ProductModel.findByIdAndUpdate();
    return product;
  };
  async getProduct(productId){
    const product = ProductModel.findById(productId);
    return product;
  }
  
};
export default ProductsDAO;

