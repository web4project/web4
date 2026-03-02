import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VaultProvider, useVault } from './context/VaultContext';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/ui/Toast';
import { useToastState, setGlobalToast } from './hooks/useToast';

import { Landing } from './pages/Landing';
import { Privacy } from './pages/Privacy';
import { HowItWorks } from './pages/HowItWorks';
import { Unlock } from './pages/Unlock';
import { Dashboard } from './pages/Dashboard';
import { QuickCapture } from './pages/QuickCapture';
import { ItemViewer } from './pages/ItemViewer';
import { Search } from './pages/Search';
import { Templates } from './pages/Templates';
import { AskVault } from './pages/AskVault';
import { Settings } from './pages/Settings';

function ProtectedVaultRoute({ children }: { children: React.ReactNode }) {
  const { status } = useVault();
  if (status === 'loading') return <div className="min-h-screen bg-black" />;
  return <AppLayout requiresUnlock>{children}</AppLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { addToast, toasts, removeToast } = useToastState();
  React.useEffect(() => { setGlobalToast(addToast); }, [addToast]);

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/privacy" element={<PublicRoute><Privacy /></PublicRoute>} />
        <Route path="/how" element={<PublicRoute><HowItWorks /></PublicRoute>} />
        <Route path="/unlock" element={<PublicRoute><Unlock /></PublicRoute>} />
        <Route path="/vault" element={<ProtectedVaultRoute><Dashboard /></ProtectedVaultRoute>} />
        <Route path="/vault/new" element={<ProtectedVaultRoute><QuickCapture /></ProtectedVaultRoute>} />
        <Route path="/vault/item/:id" element={<ProtectedVaultRoute><ItemViewer /></ProtectedVaultRoute>} />
        <Route path="/vault/search" element={<ProtectedVaultRoute><Search /></ProtectedVaultRoute>} />
        <Route path="/vault/templates" element={<ProtectedVaultRoute><Templates /></ProtectedVaultRoute>} />
        <Route path="/vault/ask" element={<ProtectedVaultRoute><AskVault /></ProtectedVaultRoute>} />
        <Route path="/vault/settings" element={<ProtectedVaultRoute><Settings /></ProtectedVaultRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <VaultProvider>
        <AppRoutes />
      </VaultProvider>
    </HashRouter>
  );
}

export default App;
