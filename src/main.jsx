import React from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import './style.css';
import { Aplicativo } from './telas.jsx';

createRoot(document.getElementById('raiz')).render(<Aplicativo />);
