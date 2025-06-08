import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCreditCard, FaRegCalendarAlt, FaLock } from 'react-icons/fa';
import '../styles/Subscription.css';

const SubscriptionSimple = () => {
  // Variables de estado y configuración
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  });
  
  // Precios de los planes
  const prices = {
    monthly: 9.99,
    annual: 99.99
  };

  // Verificar sesión de usuario al cargar
  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        setUser(response.data);
        
        // Si el usuario ya está verificado, redirigir al perfil
        if (response.data.verificado === 1) {
          navigate('/perfil');
        }

        // Si no tiene ID, redirigir al login
        if (!response.data.id) {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error al obtener la sesión:", error);
        navigate('/login');
      }
    };

    getSession();
  }, [navigate, backendUrl]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formato para el número de tarjeta: añadir espacios cada 4 dígitos
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } 
    // Formato para la fecha de expiración
    else if (name === 'cardExpiry') {
      const formattedValue = value
        .replace(/\//g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    }
    // Limitar CVC a 3-4 dígitos
    else if (name === 'cardCvc') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 4);
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Abrir el modal de pago
  const openPaymentModal = () => {
    setShowModal(true);
  };

  // Cerrar el modal de pago y resetear estados
  const closeModal = () => {
    setShowModal(false);
    setPaymentProcessing(false);
    setPaymentSuccess(false);
    setFormData({
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      cardName: ''
    });
  };

  // Manejar el envío del formulario de pago
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Actualizar estado de verificación del usuario
      await axios.post(
        `${backendUrl}/users/UserController.php?action=verify`,
        { userId: user.id },
        { withCredentials: true }
      );

      setPaymentProcessing(false);
      setPaymentSuccess(true);
      
      // Redireccionar después de unos segundos
      setTimeout(() => {
        navigate('/perfil');
      }, 3000);
      
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setPaymentProcessing(false);
      alert("Error al procesar el pago. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="subscription-page">
      <Container>
        {/* Encabezado */}
        <Row className="text-center mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="cyber-title">EVOLUCIONA A <span className="text-gradient">PREMIUM</span></h1>
              <div className="cyber-line"></div>
              <h3 className="cyber-subtitle">DESBLOQUEA TU POTENCIAL DIGITAL</h3>
            </motion.div>
          </Col>
        </Row>

        {/* Tarjeta de plan premium */}
        <Row className="justify-content-center">
          <Col md={8}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Card className="premium-card mb-5">
                <Card.Body>
                  <Row>
                    <Col className="p-4">
                      <h2 className="tech-title">ACCESO PREMIUM</h2>
                      <div className="cyber-divider mb-4"></div>
                      
                      {/* Lista de beneficios */}
                      <ul className="cyber-benefits-list">
                        <li><span className="cyber-bullet"></span> Acceso a todas las funcionalidades</li>
                        <li><span className="cyber-bullet"></span> Acceso a Foro de usuarios</li>
                      </ul>
                      
                      {/* Selector de plan */}
                      <div className="mt-4">
                        <div className="plan-toggle mb-3">
                          <button 
                            className={`plan-option ${selectedPlan === 'monthly' ? 'active' : ''}`}
                            onClick={() => setSelectedPlan('monthly')}
                            type="button"
                          >
                            Mensual
                          </button>
                          <button 
                            className={`plan-option ${selectedPlan === 'annual' ? 'active' : ''}`}
                            onClick={() => setSelectedPlan('annual')}
                            type="button"
                          >
                            Anual <span className="save-badge">Ahorra 20%</span>
                          </button>
                        </div>
                        
                        {/* Botón de activación */}
                        <Button
                          size="lg" 
                          className="cyber-button w-100 mt-3" 
                          onClick={openPaymentModal}
                        >
                          <span className="button-text">
                            ACTIVAR AHORA - {selectedPlan === 'monthly' 
                              ? `€${prices.monthly}/mes` 
                              : `€${prices.annual}/año`}
                          </span>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Modal de pago */}
      <Modal 
        show={showModal} 
        onHide={closeModal} 
        centered
        backdrop="static"
        className="payment-modal absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] backdrop-blur-2xl w-full h-full"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">
            {paymentSuccess ? "¡Pago Completado!" : "Complete su Suscripción Premium"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentSuccess ? (
            <div className="text-center py-4">
              <div className="success-animation">
                <FaCheckCircle size={80} className="text-success mb-4" />
              </div>
              <h4 className="mb-3">¡Bienvenido a Premium!</h4>
              <p className="mb-4">Tu cuenta ha sido verificada correctamente. Serás redirigido a tu perfil en unos segundos.</p>
              <div className="d-flex justify-content-center">
                <Button variant="primary" onClick={() => navigate('/perfil')}>
                  Ir a mi perfil
                </Button>
              </div>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <div className="payment-card-container">
                <div className="mb-3 text-center">
                  <h5 className="mb-3"><FaCreditCard className="me-2 input-icon" /> Datos de Pago</h5>
                  <p className="small text-light">Ingresa los datos de tu tarjeta para activar tu plan {selectedPlan === 'monthly' ? 'mensual' : 'anual'}</p>
                </div>
                
                <Form.Group className="mb-3" controlId="cardName">
                  <Form.Label><FaCreditCard className="me-2 input-icon" /> Nombre del titular</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="Nombre completo del titular"
                    className="cyber-input"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="cardNumber">
                  <Form.Label><FaCreditCard className="me-2 input-icon" /> Número de tarjeta</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="cyber-input"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="cardExpiry">
                      <Form.Label><FaRegCalendarAlt className="me-2 input-icon" /> Expiración</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="cyber-input"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="cardCvc">
                      <Form.Label><FaLock className="me-2 input-icon" /> CVC</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="XXX"
                        className="cyber-input"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <Button 
                variant="primary" 
                type="submit" 
                className="cyber-button w-100"
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </span>
                ) : (
                  <span>
                    COMPLETAR PAGO - 
                    {selectedPlan === 'monthly' 
                      ? `€${prices.monthly}/mes` 
                      : `€${prices.annual}/año`}
                  </span>
                )}
              </Button>
              <div className="text-center mt-3">
                <small className="text-muted">
                  <FaLock className="me-1" /> Transacción segura con encriptación de nivel cuántico
                </small>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubscriptionSimple;
