const form = document.getElementById('form')
const proname = document.getElementById('proname') || {}
const unit = document.getElementById('unit') || {}
const description = document.getElementById('description') || {}
const category = document.getElementById('category') || {}
const image = document.getElementById('image') || {}
const email = document.getElementById('email') || {}
const lname = document.getElementById('lname') || {}
const password = document.getElementById('password') || {value:"12345678"}
const username = document.getElementById('username') || {}
const quantity = document.getElementById('quantity') || {}
const price = document.getElementById('price') || {value:"12"}


form.addEventListener('submit', e => {
    e.preventDefault()
    if (validateInputs() == true) {
        form.submit()
    }
})


function setError(input, message) {
    const formControl = input
    //const small = formControl.querySelector('small');
    formControl.className = 'form-control is-invalid'
    //small.innerText = message;
}

function setSuccess(input) {
    const formControl = input
    formControl.className = 'form-control is-valid'
}

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}
function isInDesiredForm(str) {
    return /^\+?\d+$/.test(str)
}
function isPrice(str) {
    return /^\+?\d+$/.test(str)
}


const validateInputs = () => {
    const nameValue = proname.value
    const unitValue = unit.value
    const descriptionValue = description.value
    const categoryValue = category.value
    const imageValue = image.value
    const lnameValue = lname.value
    const emailValue = email.value
    const usernameValue = username.value
    const passwordValue = password.value
    const quantityValue = quantity.value
    const priceValue = price.value
    

    if (nameValue === '') {
        setError(proname, 'Product name is required')
        return false
    } else {
        setSuccess(proname)
    }
    if (categoryValue === '') {
        setError(category, 'Category is required')
        return false
    } else {
        setSuccess(category)
    }
    if (unitValue === '') {
        setError(unit, 'Unit is required')
        return false
    } else {
        setSuccess(unit)
    }

    if (descriptionValue === '') {
        setError(description, 'Description is required')
        return false
    } else {
        setSuccess(description)
    }
    if (imageValue === '') {
        setError(image, 'Image is required')
        return false
    } else {
        setSuccess(image)
    }

    //USER
    if (lnameValue === '') {
        setError(lname, 'Last name is required')
        return false
    } else {
        setSuccess(lname)
    }
    if (emailValue === '') {
        setError(email, 'Email is required')
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address')
    } else {
        setSuccess(email)
    }
    if (usernameValue === '') {
        setError(username, 'Username is required')
        return false
    } else {
        setSuccess(username)
    }
    if (passwordValue === '') {
        setError(password, 'Password is required')
        return false
    } else {
        if (passwordValue.length < 8) {
            setError(password, 'Password must be at least 8 character.')
            return false
        } else {
            setSuccess(password)
        }
    }
    
    if(quantityValue === ''){
        setError(quantity, 'Quantity is required')
        return false
    }else if (!isInDesiredForm(quantityValue)) {
        setError(quantity, 'Quantity must be a number')
    }else{
        setSuccess(quantity)
    }

    if(priceValue === ''){
        setError(price, 'Price is required')
        return false
    }else if (!isPrice(priceValue)) {
        setError(price, 'Price must be a number')
        return false
    }else{
        setSuccess(price)
    }
    
    return true
}



