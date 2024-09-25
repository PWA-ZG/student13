"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_openid_connect_1 = require("express-openid-connect");
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var client_1 = require("@prisma/client");
var multer_1 = __importDefault(require("multer"));
var body_parser_1 = __importDefault(require("body-parser"));
var fs_1 = __importDefault(require("fs"));
var Post_1 = __importDefault(require("./models/Post"));
var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 3000;
var baseURL = host == 'localhost' ? "http://".concat(host, ":").concat(port) : "https://".concat(host);
var app = (0, express_1.default)();
var viewsPath = path_1.default.join(__dirname, '/public/views');
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
dotenv_1.default.config();
var config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: baseURL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://dev-gzizuvkh2i7yo8yr.us.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email',
    }
};
var prisma = new client_1.PrismaClient();
var UPLOAD_PATH = path_1.default.join(__dirname, "public", "uploads");
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, req.body.id + '.jpg');
    }
});
var upload = (0, multer_1.default)({ storage: storage }).single('image');
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use((0, express_openid_connect_1.auth)(config));
app.get("/", function (req, res) {
    if (req.oidc.isAuthenticated()) {
        res.redirect("/posts");
    }
    else {
        res.render("index", { user: req.oidc.user });
    }
});
app.get("/posts", (0, express_openid_connect_1.requiresAuth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.posts.findMany({
                    include: {
                        likes: true
                    },
                    orderBy: {
                        published_at: 'asc'
                    }
                })
                    .then(function (posts) {
                    return posts.map(function (post) {
                        var likes = post.likes.length;
                        var userLiked = post.likes.some(function (like) { return like.user_id == req.oidc.user.sub; });
                        var imagePath = path_1.default.join(__dirname, 'public', 'uploads', "".concat(post.id, ".jpg"));
                        var imageUrl = fs_1.default.existsSync(imagePath) ? "../uploads/".concat(post.id, ".jpg") : '../uploads/default.png';
                        return new Post_1.default(post.id, post.author, post.published_at, post.title, post.description, likes, userLiked, imageUrl);
                    });
                })];
            case 1:
                posts = _a.sent();
                res.render("posts", { user: req.oidc.user, posts: posts.sort(function (a, b) { return b.publishedAt.getTime() - a.publishedAt.getTime(); }) });
                return [2 /*return*/];
        }
    });
}); });
app.post("/posts", (0, express_openid_connect_1.requiresAuth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        upload(req, res, function (err) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!err) return [3 /*break*/, 1];
                        console.log(err);
                        res.status(500).send(err);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, prisma.posts.create({
                            data: {
                                id: req.body.id,
                                author: req.oidc.user.name,
                                title: req.body.title,
                                description: req.body.description
                            }
                        })
                            .then(function (post) {
                            console.log("Post created: ", post);
                            res.redirect("/posts/".concat(post.id));
                        })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
app.get("/posts/:id", (0, express_openid_connect_1.requiresAuth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.posts.findUnique({
                    include: {
                        likes: true
                    },
                    where: {
                        id: req.params.id
                    }
                })
                    .then(function (post) {
                    if (post) {
                        var likes = post.likes.length;
                        var userLiked = post.likes.some(function (like) { return like.user_id == req.oidc.user.sub; });
                        var imagePath = path_1.default.join(__dirname, 'public', 'uploads', "".concat(post.id, ".jpg"));
                        var imageUrl = fs_1.default.existsSync(imagePath) ? "../uploads/".concat(post.id, ".jpg") : '../uploads/default.png';
                        return new Post_1.default(post.id, post.author, post.published_at, post.title, post.description, likes, userLiked, imageUrl);
                    }
                    else {
                        return null;
                    }
                })];
            case 1:
                post = _a.sent();
                if (!post) {
                    res.status(404).send("Post not found!");
                    return [2 /*return*/];
                }
                res.render("post", { user: req.oidc.user, post: post });
                return [2 /*return*/];
        }
    });
}); });
app.get("/like/:postId", (0, express_openid_connect_1.requiresAuth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postId = req.params.postId;
                return [4 /*yield*/, prisma.posts.findUnique({
                        include: {
                            likes: true
                        },
                        where: {
                            id: postId
                        }
                    })
                        .then(function (post) {
                        if (post) {
                            var likes = post.likes.length;
                            var userLiked = post.likes.some(function (like) { return like.user_id == req.oidc.user.sub; });
                            return new Post_1.default(post.id, post.author, post.published_at, post.title, post.description, likes, userLiked);
                        }
                        else {
                            return null;
                        }
                    })];
            case 1:
                post = _a.sent();
                if (!post) {
                    res.status(404).send("Post not found!");
                    return [2 /*return*/];
                }
                if (!post.userLiked) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.likes.deleteMany({
                        where: {
                            post_id: postId,
                            user_id: req.oidc.user.sub
                        }
                    })
                        .then(function (like) {
                        console.log("Like created: ", like);
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.likes.create({
                    data: {
                        post_id: postId,
                        user_id: req.oidc.user.sub
                    }
                })
                    .then(function (like) {
                    console.log("Like created: ", like);
                })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
app.get("/new-post", (0, express_openid_connect_1.requiresAuth)(), function (req, res) {
    res.render("new_post", { user: req.oidc.user });
});
app.get("/signup", function (req, res) {
    res.oidc.login({
        returnTo: req.get('referer') || '/',
        authorizationParams: {
            screen_hint: "signup",
        },
    });
});
app.get("/*", function (req, res) {
    res.status(404).render("not_found");
});
app.listen(port, function () {
    console.log("Listening at ".concat(baseURL));
});
