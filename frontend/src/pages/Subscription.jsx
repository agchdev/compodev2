import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaRocket, FaUserAstronaut, FaSatelliteDish, FaGlobeAmericas, FaBolt, FaShieldAlt } from 'react-icons/fa';
import '../styles/Subscription.css';

const Subscription = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  });

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
          navigate('/profile');
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
    // Formato para la fecha de expiración: añadir / después de los primeros 2 dígitos
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

  const openPaymentModal = () => {
    setShowModal(true);
  };

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
        navigate('/profile');
      }, 3000);
      
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setPaymentProcessing(false);
      alert("Error al procesar el pago. Por favor, inténtalo de nuevo.");
    }
  };

  const benefits = [
    {
      icon: <FaCheckCircle className="feature-icon" />,
      title: "Cuenta Verificada",
      description: "Obtén la insignia de verificación que te destaca del resto."
    },
    {
      icon: <FaRocket className="feature-icon" />,
      title: "Acceso Prioritario",
      description: "Sé el primero en acceder a nuevas características y contenidos."
    },
    {
      icon: <FaUserAstronaut className="feature-icon" />,
      title: "Perfil Destacado",
      description: "Tu perfil aparecerá destacado en los resultados de búsqueda."
    },
    {
      icon: <FaSatelliteDish className="feature-icon" />,
      title: "Comunicación Avanzada",
      description: "Mensajería sin límites y comunicaciones encriptadas."
    },
    {
      icon: <FaGlobeAmericas className="feature-icon" />,
      title: "Acceso Global",
      description: "Conéctate con usuarios premium de todo el mundo."
    },
    {
      icon: <FaBolt className="feature-icon" />,
      title: "Rendimiento Ultra",
      description: "Experimenta la plataforma al máximo rendimiento sin esperas."
    }
  ];

  return (
    <div className="subscription-page">
      {/* Fondo animado */}
      <div className="space-background">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        <div className="planet"></div>
      </div>

      <Container className="subscription-container py-5">
        <Row className="justify-content-center mb-5">
          <Col md={10} className="text-center">
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

        <Row className="justify-content-center">
          <Col md={8}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Card className="premium-card mb-5">
                <Card.Body className="p-0">
                  <Row className="g-0">
                    <Col md={7} className="p-4">
                      <h2 className="tech-title">ACCESO PREMIUM</h2>
                      <div className="cyber-divider mb-4"></div>
                      
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <FaShieldAlt className="me-2 text-primary" />
                          <h5 className="mb-0">Cuenta Verificada</h5>
                        </div>
                        <p className="text-muted ms-4">Únete a la élite digital con un status verificado</p>
                      </div>
                      
                      <ul className="cyber-features">
                        <li><span className="cyber-bullet"></span> Insignia de verificación exclusiva</li>
                        <li><span className="cyber-bullet"></span> Prioridad en todas las interacciones</li>
                        <li><span className="cyber-bullet"></span> Soporte técnico dedicado 24/7</li>
                        <li><span className="cyber-bullet"></span> Almacenamiento en la nube ampliado</li>
                        <li><span className="cyber-bullet"></span> Análisis avanzados de tu perfil</li>
                      </ul>
                      
                      <div className="mt-4">
                        <Button 
                          variant="primary" 
                          size="lg" 
                          className="cyber-button" 
                          onClick={openPaymentModal}
                        >
                          <span className="button-text">ACTIVAR AHORA</span>
                          <span className="button-glitch"></span>
                        </Button>
                      </div>
                    </Col>
                    <Col md={5} className="premium-card-graphic">
                      <div className="hologram-container">
                        <div className="hologram-effect"></div>
                        <div className="hologram-circle"></div>
                        <div className="hologram-glow"></div>
                        <div className="price-tag">
                          <span className="price">€9.99</span>
                          <span className="period">/mes</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="text-center mb-4">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              CARACTERÍSTICAS CUÁNTICAS
            </motion.h2>
            <div className="neon-line"></div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {benefits.map((benefit, index) => (
            <Col md={4} key={index} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
              >
                <Card className="feature-card h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="feature-icon-container mb-3">
                      {benefit.icon}
                    </div>
                    <h4 className="feature-title">{benefit.title}</h4>
                    <p className="feature-description">{benefit.description}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Modal de pago */}
      <Modal 
        show={showModal} 
        onHide={closeModal} 
        centered
        backdrop="static"
        className="payment-modal"
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
                <div className="checkmark">
                  <FaCheckCircle size={80} className="text-success mb-4" />
                </div>
              </div>
              <h4 className="mb-3">¡Bienvenido a Premium!</h4>
              <p className="mb-4">Tu cuenta ha sido verificada correctamente. Serás redirigido a tu perfil en unos segundos.</p>
              <div className="d-flex justify-content-center">
                <Button variant="primary" onClick={() => navigate('/profile')}>
                  Ir a mi perfil
                </Button>
              </div>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre en la tarjeta</Form.Label>
                <Form.Control
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                  disabled={paymentProcessing}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Número de tarjeta</Form.Label>
                <Form.Control
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  disabled={paymentProcessing}
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de expiración</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      required
                      disabled={paymentProcessing}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>CVC</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      placeholder="123"
                      required
                      disabled={paymentProcessing}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={paymentProcessing}
                  className="cyber-button-sm"
                >
                  {paymentProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : "Confirmar Pago - €9.99/mes"}
                </Button>
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Transacción segura con encriptación de nivel cuántico
                  </small>
                </div>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Subscription;
