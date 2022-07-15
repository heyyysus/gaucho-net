import Express from 'express';
import { PORT } from './config.json';
import AuthRouter from './routes/auth';
import cors from 'cors';
import requireAuth from './middleware/requireAuth';
import UsersRouter from './routes/users';
import PostsRouter from './routes/posts'

const app = Express();
app.use(Express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("success");
});

app.use("/auth", AuthRouter);
app.use("/api/users", requireAuth, UsersRouter);
app.use("/api/posts", requireAuth, PostsRouter);

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});