import React, { Component } from "react"
import PropTypes from "prop-types"
import classnames from 'classnames'

export default class FollowButton extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      loading: false,
      relationship: props.relationship
    }
  }
  
  follow = () => {
    this.setState({
      loading: true
    })
    
    const baseurl = window.location.origin
    fetch(baseurl + '/relationships', {
      method: 'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        followed_id: this.props.user.id
      })
    })
    .then(response => response.json())
    .then(data => {
      this.setState({
        loading: false,
        relationship: data
      })
    })
  }
  
  unfollow = () => {
    this.setState({
      loading: true
    })
    
    const baseurl = window.location.origin
    fetch(baseurl + '/relationships/' + this.state.relationship.id, {
      method: 'DELETE',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({
        loading: false,
        relationship: null
      })
    })
  }
  
  render() {
    const isFollowing = this.state.relationship !== null
    const className = classnames('btn', {
      'btn-danger': isFollowing,
      'btn-primary': !isFollowing
    })
    
    return (
      <button
        className = { className }
        onClick={ isFollowing ? this.unfollow : this.follow }
        disabled={ this.state.loading }
      >
        { isFollowing ? 'Unfollow' : 'Follow' }
      </button>
    )
  }
}

FollowButton.defaultProps = {
  relationship: null
}

FollowButton.propTypes = {
  user: PropTypes.object.isRequired,
  relationship: PropTypes.object
}