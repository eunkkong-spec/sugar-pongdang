import ProductCard from './ProductCard.jsx'
import './ProductGrid.css'

function ProductGrid({ title, point, icon, products }) {
  return (
    <section className="section product-grid">
      <h2 className="section-title">
        {title} {point && <em>{point}</em>}
        <span>{icon}</span>
      </h2>

      <ul className="list">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProductGrid
