// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProduct} = props
  const {title, price, brand, imageUrl, rating} = similarProduct
  return (
    <li className="similar-container">
      <img src={imageUrl} alt={`similar product ${title}`} className="image" />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <div className="price-container">
        <p>RS {price}</p>
        <button type="button" className="rating-star">
          {rating}
        </button>
      </div>
    </li>
  )
}

export default SimilarProductItem
