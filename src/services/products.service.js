import ProductsDAO from "../DAO/classes/product.dao.js";
const productsDAO = new ProductsDAO();
class ServiceProducts {
    async getAllProducts() {
        try {
            const products = await productsDAO.getAllProd();
            return products;
        } catch (error) {
            throw new Error(error);
        }
    }
    async getProductById(productId) {
        try {
            const one = await productsDAO.getProduct(productId);
            return one;
        } catch (error) {
            throw new Error(error);
        }
    }
    async createProduct(productData) {
        try {
            const newProd = await productsDAO.createOneProduct(productData);
            return newProd;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProduct(productId, productData) {
        try {
            const productUpdate = await productsDAO.updateOneProduct(
                productId,
                productData,
                { new: true }
            );
            return productUpdate;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const delProd = await productsDAO.deleteOneProduct(productId);
            return delProd;
        } catch (error) {
            throw new Error(error);
        }
    }
};

export default ServiceProducts;