import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { email } from "zod";
import { create } from "node:domain";


const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET debe tener al menos 32 caracteres!")
    }
    return secret;
}
//registrar usuario
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Datos de registro inválidos"
            });
        }

        const cleanName = name.trim()
        const cleanEmail = email.trim().toLowerCase()

        if (cleanName.length < 2 || cleanName.length > 80) {
            return res.status(400).json({
                message: "El nombre debe tener entre 2 y 80 caracteres"
            });
        }

        if (password.length < 8 || password.length > 128) {
            return res.status(400).json({
                message: "La contraseña debe tener entre 8 y 128 caracteres"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                message: "Correo electrónico inválido"
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "El correo electrónico ya está registrado"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name: cleanName,
                email: cleanEmail,
                passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        const token = jwt.sign(
            { sub: user.id },
            getJWTSecret(),
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            message: "Usuario creado correctamente!",
            token,
            user
        });
    }
    catch (error) {
        console.error("Error al registrar usuario: ", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

//iniciar sesion

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Correo y contraseña son obligatorios"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (!user) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordValid) {
            return res.status(401).json({
                message: "Credenciales incorrectas!"
            });
        }

        const token = jwt.sign(
            { sub: user.id },
            getJWTSecret(),
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });


    } catch (error) {
        console.error("Error en el login: ", error)

        return res.status(500).json({
            message: "Error interno del servidor!"
        });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "NO autorizado!"
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Error en getMe:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}
