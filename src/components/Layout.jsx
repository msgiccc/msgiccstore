import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
      {children}
    </>
  );
}
