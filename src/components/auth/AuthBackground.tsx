/* src/components/AuthBackground.tsx */

function AuthBackground() {
  return (
    <div className="fixed inset-0 z-10">
      {/* Bottom waves */}
      <div 
        className={`wave`}
        style={{ zIndex: 10 }}
      />
      <div 
        className={`wave`}
        style={{ zIndex: 10 }}
      />
      <div 
        className={`wave`}
        style={{ zIndex: 10 }}
      />
      
      {/* Top waves */}
      <div 
        className={`wave-top`}
        style={{ zIndex: 10 }}
      />
      <div 
        className={`wave-top`}
        style={{ zIndex: 10 }}
      />
      <div 
        className={`wave-top`}
        style={{ zIndex: 10 }}
      />
    </div>
  );
}

export default AuthBackground;