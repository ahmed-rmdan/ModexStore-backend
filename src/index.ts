import  express  from "express";
import dotenv from 'dotenv'
import helmet from "helmet";
import { setheaders } from "./middleware";


dotenv.config()


const app=express()

app.use(helmet())
app.use(setheaders)


app.use(express.json())

app.listen(3000)