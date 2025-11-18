import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

type View = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('haroldo90@hotmail.com');
  const [password, setPassword] = useState('chevropar#1970');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const switchView = (newView: View) => {
    setView(newView);
    setError(null);
    setSuccessMessage(null);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === 'Invalid login credentials') {
        setError('Email o contraseña incorrectos.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor, verifica tu email antes de iniciar sesión.');
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) {
        console.error("Signup Error:", error);
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('user already registered')) {
            setError('Ya existe un usuario con este correo electrónico.');
        } else if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
            setError('El correo electrónico no es válido o el dominio no está permitido. Por favor, revísalo o intenta con otro (ej. Gmail, Outlook).');
        } else if (errorMessage.includes('password should be at least')) {
            setError('La contraseña es demasiado corta. Debe tener al menos 6 caracteres.');
        } else if (errorMessage.includes('database error saving new user')) {
            setError('Ocurrió un error al crear tu perfil. Por favor, contacta a soporte.');
        } else {
            setError('Ocurrió un error inesperado. Revisa tus datos e intenta de nuevo.');
        }
    } else {
        setSuccessMessage('¡Registro exitoso! Revisa tu email para verificar tu cuenta y poder iniciar sesión.');
        setFullName('');
        setEmail('');
        setPassword('');
    }
    setLoading(false);
  };

  const commonInputStyles = "w-full bg-[#2a2a2a] text-white placeholder-gray-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFDF00] border border-transparent focus:border-[#FFDF00]";
  const commonButtonStyles = "w-full bg-[#FFDF00] text-[#181818] font-bold py-3 rounded-lg transform hover:scale-[1.03] transition-transform duration-200 disabled:opacity-50 disabled:scale-100";

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <img src="https://appdesignmex.com/parito.png" alt="Paritos Logo" className="w-24 h-24" />
        </div>
        
        <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-lg">
            <div className="flex border-b border-[#3A3D42] mb-6">
                <button 
                    onClick={() => switchView('login')}
                    className={`w-1/2 py-3 text-sm font-bold transition-colors ${view === 'login' ? 'text-[#FFDF00] border-b-2 border-[#FFDF00]' : 'text-gray-400'}`}
                >
                    Iniciar Sesión
                </button>
                <button 
                    onClick={() => switchView('register')}
                    className={`w-1/2 py-3 text-sm font-bold transition-colors ${view === 'register' ? 'text-[#FFDF00] border-b-2 border-[#FFDF00]' : 'text-gray-400'}`}
                >
                    Registrarse
                </button>
            </div>
            
            {error && <p className="bg-red-500/20 text-red-400 text-center text-sm p-3 rounded-lg mb-4">{error}</p>}
            {successMessage && <p className="bg-green-500/20 text-green-400 text-center text-sm p-3 rounded-lg mb-4">{successMessage}</p>}
            
            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-6">
                {view === 'register' && (
                    <div>
                        <input type="text" placeholder="Nombre Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} className={commonInputStyles} required />
                    </div>
                )}
                <div>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={commonInputStyles} required />
                </div>
                <div>
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className={commonInputStyles} required />
                </div>
                <button type="submit" disabled={loading} className={commonButtonStyles}>
                    {loading ? 'Procesando...' : (view === 'login' ? 'Entrar' : 'Crear Cuenta')}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;