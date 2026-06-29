import { ZodError } from "zod";
import {logger} from "../config/logger.config.js"
import { StatusCodes } from "http-status-codes";
import { config } from "../config/env.config.js";

export function errorHandler(err, req, res, next) {
  // logger.error('❌ Error:', err.stack);
  if(!config.env.isProd){
    console.log(err instanceof ZodError?`(Zod Error) ${err?.issues[0]?.path} => ${err?.issues[0]?.message}`:err)
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if(err instanceof ZodError){
     return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
         success: false,
         message: err?.issues[0]?.message ?? "Validation error",
         stack: config.env.isDev ? err.stack : undefined,
     })
  }

  return res.status(statusCode).json({
      success: false,
      message,
      stack: config.env.isDev ? err.stack : undefined,
  })
}
