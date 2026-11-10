import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, UserPlus, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../utils/errors";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: typeof formErrors = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      errors.name = "El nombre es obligatorio";
    } else if (cleanName.length < 2 || cleanName.length > 80) {
      errors.name = "El nombre debe tener entre 2 y 80 caracteres";
    }

    if (!cleanEmail) {
      errors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = "Introduce un formato de correo válido";
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria";
    } else if (password.length < 8 || password.length > 128) {
      errors.password = "La contraseña debe tener entre 8 y 128 caracteres";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      success("¡Cuenta creada exitosamente!", `Bienvenido a IoT Control, ${user.name}`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err, "Error al crear la cuenta. Intenta nuevamente.");
      setServerError(msg);
      toastError("Error en el registro", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-cafe-roast/70 shadow-coffee-lg backdrop-blur-xl bg-cafe-deep/85">
      <CardHeader className="text-center sm:text-left">
        <CardTitle className="text-xl text-cafe-cream flex items-center justify-between">
          <span>Crear Cuenta</span>
          <UserPlus className="w-5 h-5 text-cafe-caramel" />
        </CardTitle>
        <CardDescription>
          Regístrate para vincular y controlar tus módulos ESP8266
        </CardDescription>
      </CardHeader>

      <CardContent>
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-status-offline/15 border border-status-offline/40 text-xs text-status-offline animate-fade-in flex items-start gap-2">
            <span>•</span>
            <span className="flex-1 font-medium">{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Nombre completo"
            placeholder="Ej. Roberto Gómez"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={formErrors.name}
            leftIcon={<User className="w-4 h-4" />}
            autoFocus
          />

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={formErrors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <Input
            label="Contraseña (mínimo 8 caracteres)"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={formErrors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (formErrors.confirmPassword)
                setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            error={formErrors.confirmPassword}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? "Registrando..." : "Crear mi cuenta"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-cafe-roast/40 text-center">
          <p className="text-xs text-cafe-muted">
            ¿Ya tienes una cuenta registrada?{" "}
            <Link
              to="/login"
              className="text-cafe-caramel hover:text-cafe-latte font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

