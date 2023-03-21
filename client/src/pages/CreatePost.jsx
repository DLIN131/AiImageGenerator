import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {preview} from '../assets'
import {getRandomPrompt} from '../utils'
import {FormField, Loader} from '../components'

const CreatePost = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  })

  const [generatingImg, setGeneratingImg] = useState(false)
  const [loading, setLoading] = useState(false)

  const generateImage = async () =>{
    if(form.prompt){
      try {
        setGeneratingImg(true)
        const response = await fetch('http://localhost:8080/api/v1/dalle',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({prompt: form.prompt}),
        })
        console.log(response)
        
        const data = await response.json()

        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`})
      } catch (error) {
        alert(error)
      } finally{
        setGeneratingImg(false)
      }
    }else{
      alert('Please enter a prompt')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(form.prompt && form.photo){
      setLoading(true)

      try {
          const response = await fetch('http://localhost:8080/api/v1/post',{
            method: 'POST',
            headers: {
              'Content-Type': 'Application/json',
            },
            body: JSON.stringify(form)
          })

          await response.json();
          navigate('/')
      } catch (error) {
        alert(error)
      } finally{
        setLoading(false)
      }
    } else{
      alert('Please enter a prompt and generate an image')
    }
  }

  const handleNameChange = (e) =>{
    
    setForm({...form, [e.target.name]: e.target.value})
  }
  const handlePromptChange = (e) =>{
    
    setForm({...form, prompt: e.target.value})
  }

  const handleSurpriseMe = () =>{
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({...form, prompt: randomPrompt})
  }
  return (
    <section className='max-w-7xl mx-auto '>
      <div>
          <h1 className='font-extrabold text-[black] 
          text-[32px]'>Create</h1>
          <p className='mt-2 text-[#666e75] text-[14px] max-w[500px]'>
          Create imaginate and visually stunning 
          images through DALL-E AI and share them with the comunity</p>
      </div>
      
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName="你的名字"
            type="text"
            name="name"
            placeHolder="XXX"
            value={form.name}
            handleChange={handleNameChange}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="Prompt"
            placeHolder="an armchair in the shape of an avocado"
            value={form.prompt}
            handleChange={handlePromptChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex
          justify-center items-center'>
            {form.photo?(
              <img 
              src={form.photo}
              alt={form.prompt}
              className='w-full h-full object-contain'/>
            ):(
              <img 
              src={preview}
              alt="preview"
              className='w-9/12 h9/12 object-contain opacity-40'/>
            )}

            {generatingImg && (
              <div className='absolute insert-0 z-0 flex justify-center 
              items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader/>
              </div>
            ) 
            }
          </div>
        </div>
        <div className='mt-5 flex gap-5'>
          <button 
            type="button"
            onClick={generateImage}
            className='text-white bg-green-700 font-medium 
            rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
              {generatingImg? '生成中...' : '生成'}
          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75]'>可以將生成好的圖片分享到社群</p>
          <button 
            type="submit"
            className='mt-3 text-white bg-[#6469ff] font-medium
            rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
            {loading ? '分享中...' : '上傳到主頁'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost
