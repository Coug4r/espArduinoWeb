import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../utils/errors";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Introduce un correo electrónico válido";
    }

    if (!password) {
      errors.password = "La contraseña es requerida";
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
      const user = await login({ email: email.trim(), password });
      success("¡Bienvenido de nuevo!", `Sesión iniciada como ${user.name}`);

      const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err, "Credenciales incorrectas o servidor no disponible");
      setServerError(msg);
      toastError("Error al iniciar sesión", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-cafe-roast/70 shadow-coffee-lg backdrop-blur-xl bg-cafe-deep/85">
      <CardHeader className="text-center sm:text-left">
        <CardTitle className="text-xl text-cafe-cream flex items-center justify-between">
          <span>Iniciar Sesión</span>
          <LogIn className="w-5 h-5 text-cafe-caramel" />
        </CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder al control de tus dispositivos
        </CardDescription>
      </CardHeader>

      <CardContent>
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-status-offline/15 border border-status-offline/40 text-xs text-status-offline animate-fade-in flex items-start gap-2">
            <span>•</span>
            <span className="flex-1 font-medium">{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            autoFocus
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={formErrors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? "Autenticando..." : "Ingresar a la plataforma"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-cafe-roast/40 text-center">
          <p className="text-xs text-cafe-muted">
            ¿No tienes una cuenta aún?{" "}
            <Link
              to="/register"
              className="text-cafe-caramel hover:text-cafe-latte font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

