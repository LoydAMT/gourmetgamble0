import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navItem}>Home</div>
        <div style={styles.navItem}>Recipe</div>
        <div style={styles.navItem}>Community</div>
        <div style={styles.navItem}>Contact</div>
        <button style={styles.signInButton}>Sign in/Sign Up</button>
      </nav>
      
      <main style={styles.mainContent}>
        <div style={styles.leftColumn}>
          <h1 style={styles.mainHeading}>
            Parlay Your Ingredients and<br />Stake Your Meals
          </h1>
          <p style={styles.subHeading}>
            Parlay Your Ingredients and Stake Your Meals on Winning Recipes
          </p>
          <input 
            style={styles.searchBar} 
            type="text" 
            placeholder="Search Ingredient Here"
          />
          <div style={styles.ingredientCards}>
            <button style={styles.scrollButton}>{'<'}</button>
            {['fsdffdfdsf', 'fsdffdfdsf', 'fsdffdfdsf'].map((text, index) => (
              <div key={index} style={styles.card}>
                <img src={`https://via.placeholder.com/100?text=Ingredient${index+1}`} alt="Ingredient" style={styles.cardImage} />
                <p>{text}</p>
              </div>
            ))}
            <button style={styles.scrollButton}>{'>'}</button>
          </div>
        </div>
        <div style={styles.rightColumn}>
          <div style={styles.mainImage}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/93dbb781c0deb85382084d502707c0bc26e5e707b4a196271d30a9e2163dd7d2?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Taco Platter" style={styles.mainImageContent} />
            <div style={styles.discoverMoreContainer}>
              <div style={styles.starIcon}>★</div>
              <button style={styles.discoverButton}>Discover More</button>
            </div>
          </div>
          <div style={styles.ratingsSection}>
            <h2 style={styles.ratingsHeading}>999+ Ratings</h2>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/93dbb781c0deb85382084d502707c0bc26e5e707b4a196271d30a9e2163dd7d2?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Food" style={styles.ratingsImage} />
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(90deg, #f6d8b0 0%, #f9ec8d 58%, #fcff6d 100%)',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Inter, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  navItem: {
    fontSize: '18px',
    color: '#143501',
    cursor: 'pointer',
  },
  signInButton: {
    backgroundColor: '#ffa62f',
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    fontSize: '18px',
    color: '#143501',
    cursor: 'pointer',
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '50%',
  },
  mainHeading: {
    fontSize: '48px',
    color: '#143501',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '18px',
    color: '#828282',
    marginBottom: '20px',
  },
  searchBar: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: 'rgba(127, 250, 116, 0.87)',
    marginBottom: '20px',
  },
  ingredientCards: {
    display: 'flex',
    overflowX: 'auto',
    gap: '20px',
  },
  card: {
    backgroundColor: '#f0bc77',
    borderRadius: '20px',
    padding: '20px',
    textAlign: 'center',
    minWidth: '150px',
  },
  cardImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  scrollButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '24px',
    cursor: 'pointer',
  },
  rightColumn: {
    width: '45%',
  },
  mainImage: {
    height: '300px',
    backgroundColor: '#ccc',
    borderRadius: '20px',
    marginBottom: '20px',
    position: 'relative',
  },
  mainImageContent: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  discoverMoreContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  starIcon: {
    backgroundColor: '#143501',
    color: '#fcff6d',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
  },
  discoverButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  ratingsSection: {
    backgroundColor: '#143501',
    borderRadius: '20px',
    padding: '20px',
    color: 'white',
  },
  ratingsHeading: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  ratingsImage: {
    width: '100%',
    borderRadius: '10px',
  },
};


export default App;
