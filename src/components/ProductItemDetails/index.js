// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productItem: {},
    similarProductDetails: [],
    activeStatus: apiStatus.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  onPlus = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onMinus = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      return this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
    return this.setState({quantity: 1})
  }

  getProductDetails = async () => {
    this.setState({activeStatus: apiStatus.inprogress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        price: data.price,
        description: data.description,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
          title: each.title,
          brand: each.brand,
          style: each.style,
          price: each.price,
          description: each.description,
          totalReviews: each.total_reviews,
          rating: each.rating,
          availability: each.availability,
        })),
      }
      this.setState({
        productItem: updatedData,
        similarProductDetails: updatedData.similarProducts,
        activeStatus: apiStatus.success,
      })
    } else {
      this.setState({activeStatus: apiStatus.failure})
    }
  }

  renderFailure = () => {
    const {history} = this.props
    const onContinue = () => {
      history.replace('/products')
    }
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1>Product Not Found</h1>
        <button type="button" onClick={onContinue}>
          Continue Shopping
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProducts = () => {
    const {activeStatus} = this.state
    switch (activeStatus) {
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.failure:
        return this.renderFailure()
      case apiStatus.inprogress:
        return this.renderLoadingView
      default:
        return null
    }
  }

  renderSuccess = () => {
    const {productItem, similarProductDetails, quantity} = this.state
    const {
      title,
      imageUrl,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productItem
    return (
      <>
        <div className="bg-container">
          <div>
            <img src={`${imageUrl}`} alt="product" className="special" />
          </div>
          <div>
            <h1>{title}</h1>
            <p>RS {price}</p>
            <div className="ratings">
              <p type="button" className="rating-button">
                {rating}
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </p>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <div>
              <BsDashSquare onClick={this.onMinus} data-testid="minus" />

              <p>{quantity}</p>

              <BsPlusSquare onClick={this.onPlus} data-testid="plus" />
            </div>
            <button type="button" className="add-cart">
              Add to Cart
            </button>
          </div>
        </div>
        <div>
          <div>
            <h1>Similar Products</h1>
            <ul className="similar-products-container">
              {similarProductDetails.map(each => (
                <SimilarProductItem
                  similarProduct={each}
                  key={each.id}
                  changeId={this.changeId}
                />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  render() {
    return <div>{this.renderProducts()}</div>
  }
}
export default ProductItemDetails
