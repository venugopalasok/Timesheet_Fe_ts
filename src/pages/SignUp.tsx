import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      // Check for empty fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        throw new Error('Please fill in all fields')
      }

      // TODO: Replace with actual registration API call
      // const response = await register(formData)
      
      // Temporary mock registration for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000))

      // On successful registration, navigate to sign in
      navigate('/signin')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign up'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4'>
      <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Create Account</h1>
          <p className='text-gray-600'>Sign up to start tracking your time</p>
        </div>

        {error && (
          <div className='bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4'>
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-2'>
                First Name
              </label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
                placeholder='John'
                required
              />
            </div>

            <div>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-2'>
                Last Name
              </label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
                placeholder='Doe'
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
              placeholder='you@example.com'
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
              placeholder='••••••••'
              required
              minLength={8}
            />
            <p className='text-xs text-gray-500 mt-1'>Must be at least 8 characters</p>
          </div>

          <div>
            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
              placeholder='••••••••'
              required
            />
          </div>

          <div className='flex items-start'>
            <input
              type='checkbox'
              id='terms'
              className='w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              required
            />
            <label htmlFor='terms' className='ml-2 text-sm text-gray-600'>
              I agree to the{' '}
              <a href='#' className='text-indigo-600 hover:text-indigo-700'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href='#' className='text-indigo-600 hover:text-indigo-700'>
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:scale-105'
            }`}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Already have an account?{' '}
            <Link to='/signin' className='text-indigo-600 hover:text-indigo-700 font-semibold'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp

