import ServiceUsers from "../services/user.service.js";
import ServiceProducts from "../services/products.service.js";
import ServiceChats from "../services/chats.service.js";
import ServiceCarts from "../services/carts.service.js";

const Users = new ServiceUsers()
/* const Products = new ServiceProducts() */
const Chats = new ServiceChats()
const newProductManager = new ServiceProducts;
const dbCarts = new ServiceCarts();

class ViewsController{
    async getAll (req, res){
        try{
            const { page, limit, sort, query }= req.query;
            const queryResult = await newProductManager.getAllProducts(page, limit, sort, query);
            const {docs, ...paginationInfo} = queryResult;
            const productsVisualice = docs.map((product) => {
                return {
                    _id: product._id.toString(),
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    code: product.code,
                    stock: product.stock,
                    category: product.category,
                    status: product.status              
                }
            });
            const response = {
                status: 'success',
                payload: productsVisualice,
                totalPages: paginationInfo.totalPages,
                prevPage: paginationInfo.prevPage,
                nextPage: paginationInfo.nextPage,
                page: parseInt(paginationInfo.page),
                hasPrevPage: paginationInfo.hasPrevPage,
                hasNextPage: paginationInfo.hasNextPage,
            };
            const prevPage = parseInt(page) - 1;
            response.hasPrevPage ? response.prevLink = `localhost:8080/products/?page=${prevPage}&limit=${limit}&sort=${sort}` : response.prevLink = null;
            const nextPage = parseInt(page) + 1;
            response.hasNextPage ? response.nextLink = `localhost:8080/products/?page=${nextPage}&limit=${limit}&sort=${sort}` : response.nextLink = null;
            if (parseInt(page) > paginationInfo.totalPages || parseInt(page) < 1) {
                throw new Error('The requested page does not exist');
            }
            const nextPageUrl = `/?page=${nextPage}&limit=${limit}&sort=${sort}`;
            const productsContext = {
            session: req.session.user,
            productsVisualice: productsVisualice,
            paginationInfo: paginationInfo,
            nextPageUrl: nextPageUrl,
            sort: sort,
            query: query
        };
        res.render('products', productsContext);
        } catch(error) {
            console.error(error);
            return res.status(400).json({
            status: 'error',
            msg: error.message,
            });
        }
    }
    async getCardbyId(req, res,next)  {
        try {
            const { cid } = req.params;
            const cart = await dbCarts.getCartService(cid);
            const simplifiedCart = cart.products.map((item) => {
                if (item.product) {
                    return {
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                    };
                }
                return null; 
                });
                res.render("carts", { cart: simplifiedCart });
            } catch (error) {
                next(error);
            }
    };
    async getLoginHome (req, res)  {
        try {
            res.cookie("cookie-test", "guardando cookie", {
                maxAge: 900000,
                httpOnly: true,
            });
            if (req.session.count) {
                req.session.count++;
            } else {
                req.session.count = 1;
            }
            console.log("Visitas: " + req.session.count);
            console.log("usuario guardado en session: ", req.user);
            
            const { register, login } = req.query;
            const session = req.session;
            if (register === 'true' && !session.user)
                return res.render("register");
            if (login === 'true' && !session.user)
                return res.render("login");
            const context = { session: session.user };
            res.render("home", context);
            
            } catch (err) {
            res.status(err.status || 500).json({
                status: "error",
                payload: err.message,
            });
            }
    }
    async getProductById (req, res) {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid);
        const productSimplificado = {
          _id: product._id.toString(),
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product.thumbnail,
          code: product.code,
          stock: product.stock,
          category: product.category,
        };
        res.render("product", { product: productSimplificado });
      } catch (error) {
        next(error);
      }
    };

    async realTimeProducts (req, res) {
    try{
        const { page, limit, sort, query } = req.query;
        const queryResult = await newProductManager.getAllProducts(page, limit, sort, query);
        const {docs, ...paginationInfo} = queryResult;
        const productsVisualice = docs.map((product) => {
            return {
                _id: product._id.toString(),
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                category: product.category                
            }
        });
        const nextPage = parseInt(page)+1;
        const nextPageUrl = `/realtimeproducts?page=${nextPage}&limit=${limit}&sort=${sort}`;
        res.render('realtimeproducts', {productsVisualice, paginationInfo, nextPageUrl, sort});
    } catch(error) {
        console.log(error)
    }
    };
}


export const viewsController = new ViewsController();