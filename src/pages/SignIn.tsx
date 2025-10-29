import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function SignIn() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      // TODO: Replace with actual authentication API call
      // const response = await login(formData.email, formData.password)
      
      // Temporary mock authentication for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation
      if (formData.email === '' || formData.password === '') {
        throw new Error('Please fill in all fields')
      }

      // On successful login, navigate to grid
      navigate('/grid')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'>
      <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome Back</h1>
          <p className='text-gray-600'>Sign in to your timesheet account</p>
        </div>

        {error && (
          <div className='bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4'>
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
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
            />
          </div>

          <div className='flex items-center justify-between'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              />
              <span className='ml-2 text-sm text-gray-600'>Remember me</span>
            </label>
            <a href='#' className='text-sm text-indigo-600 hover:text-indigo-700'>
              Forgot password?
            </a>
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-indigo-600 hover:text-indigo-700 font-semibold'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn

