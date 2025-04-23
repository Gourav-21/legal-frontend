'use client';

import { useEffect } from 'react';
import AOS from 'aos';

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  return null;
}