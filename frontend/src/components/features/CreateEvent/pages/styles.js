export const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  contentWrapper: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  headerCard: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "32px",
    marginBottom: "24px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  stepBadge: {
    width: "56px",
    height: "56px",
    background: "#059669",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  pageTitle: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#111827",
    margin: 0,
  },
  pageSubtitle: {
    color: "#4b5563",
    margin: "4px 0 0 0",
  },
  sectionContainer: {
    marginBottom: "32px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: 0,
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
    color: "white",
    transition: "all 0.2s",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  btnEmerald: {
    background: "#059669",
  },
  btnBlue: {
    background: "#2563eb",
  },
  btnSecondary: {
    padding: "12px 32px",
    background: "#e5e7eb",
    color: "#374151",
    border: "none",
    borderRadius: "12px",
    fontWeight: "500",
    cursor: "pointer",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
    border: "1px solid #f3f4f6",
    overflow: "hidden",
    transition: "all 0.3s",
  },
  cardHeaderEmerald: {
    background: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    padding: "24px",
    color: "white",
  },
  cardHeaderContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
    flex: 1,
  },
  cardActions: {
    display: "flex",
    gap: "8px",
  },
  iconBtn: {
    padding: "8px",
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.2s",
  },
  discountBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardBody: {
    padding: "24px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  ticketImage: {
    height: "192px",
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ticketPlaceholder: {
    fontSize: "64px",
    color: "white",
    opacity: 0.5,
  },
  ticketActions: {
    position: "absolute",
    top: "16px",
    right: "16px",
    display: "flex",
    gap: "8px",
  },
  iconBtnWhite: {
    padding: "8px",
    background: "rgba(255, 255, 255, 0.9)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s",
  },
  ticketType: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  ticketZone: {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 16px 0",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  ticketInfo: {
    marginBottom: "16px",
  },
  ticketPriceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  ticketPrice: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2563eb",
  },
  ticketDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  ticketValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
  },
  ticketDescription: {
    fontSize: "14px",
    color: "#4b5563",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "12px",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  footerActions: {
    display: "flex",
    justifyContent: "space-between",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "24px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  ticketModal: {
    maxWidth: "700px",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    margin: 0,
  },
  modalClose: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    color: "#6b7280",
    fontSize: "32px",
    padding: 0,
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  modalBody: {
    padding: "24px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  inputLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  textInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s",
  },
  textareaInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "all 0.2s",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    paddingTop: "16px",
  },
  currencySelector: {
    width: "192px",
  },
  inputLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  inputStyle: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    fontWeight: 500,
    outline: "none",
    transition: "all 0.2s",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
  },
  // Agregar al final del objeto styles en styles.js
  btnPurple: {
    background: '#9333ea'
  },
  cardHeaderPurple: {
    background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
    padding: '24px',
    color: 'white'
  },
  zoneSelection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'background 0.2s',
    fontSize: '14px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  contentWrapper: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  headerCard: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    marginBottom: '24px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  stepBadge: {
    width: '56px',
    height: '56px',
    background: '#059669',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  pageSubtitle: {
    color: '#4b5563',
    margin: '4px 0 0 0'
  },
  sectionContainer: {
    marginBottom: '32px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    color: 'white',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  btnEmerald: {
    background: '#059669'
  },
  btnBlue: {
    background: '#2563eb'
  },
  btnSecondary: {
    padding: '12px 32px',
    background: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #f3f4f6',
    overflow: 'hidden',
    transition: 'all 0.3s'
  },
  cardHeaderEmerald: {
    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    padding: '24px',
    color: 'white'
  },
  cardHeaderContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
    flex: 1
  },
  cardActions: {
    display: 'flex',
    gap: '8px'
  },
  iconBtn: {
    padding: '8px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s'
  },
  discountBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  cardBody: {
    padding: '24px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  ticketImage: {
    height: '192px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ticketPlaceholder: {
    fontSize: '64px',
    color: 'white',
    opacity: 0.5
  },
  ticketActions: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    gap: '8px'
  },
  iconBtnWhite: {
    padding: '8px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s'
  },
  ticketType: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 4px 0'
  },
  ticketZone: {
    fontSize: '14px',
    color: '#4b5563',
    margin: '0 0 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  ticketInfo: {
    marginBottom: '16px'
  },
  ticketPriceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  ticketPrice: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  ticketDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  ticketValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },
  ticketDescription: {
    fontSize: '14px',
    color: '#4b5563',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '12px',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  ticketModal: {
    maxWidth: '700px'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  modalClose: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    color: '#6b7280',
    fontSize: '32px',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  modalBody: {
    padding: '24px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  textInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s'
  },
  textareaInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.2s'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px'
  }
};
