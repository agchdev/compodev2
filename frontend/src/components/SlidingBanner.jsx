import '../styles/SlidingBanner.css'
import PropTypes from 'prop-types'

const SlidingBanner = ({ text = "COMPODEV" }) => {
  
  // Crear un array de 12 elementos para el carrusel infinito
  const bannerItems = [];
  for (let i = 0; i < 12; i++) {
    bannerItems.push(
      <div key={i} className="banner-item">
        <span className="banner-text">{text}</span>
        <span className="banner-separator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    );
  }
  
  return (
    <div className="sliding-banner-wrapper">
      <div className="sliding-banner-container">
        <div className="sliding-banner">
          <div className="banner-content">
            {bannerItems}
            {bannerItems}
          </div>
        </div>
      </div>
    </div>
  )
}

SlidingBanner.propTypes = {
  text: PropTypes.string
}

export default SlidingBanner
