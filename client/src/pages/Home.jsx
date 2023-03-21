import React,{useState, useEffect} from 'react'
import {Loader, Card, FormField} from '../components'

const RenderCards = ({data,title}) => {
    if(data?.length>0){
        return data.map((post) => <Card key={post._id}{...post}></Card>)
    } 

    return (
        <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>{title}</h2>
    )
}

const Home = () => {
    const [loading, setloading] = useState(false)
    const [allPost, setAllPosts] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [searchedResults, setSearchedResults] = useState(null)
    const [searchTimeout, setSearchTimeout] = useState(null)

    useEffect(() => {
        const fetchPosts = async () => {
            setloading(true)
            try {
                const response = await fetch('http://localhost:8080/api/v1/post',{
                    method: 'GET',
                    headers: {
                    'Content-Type': 'Application/json',
                    },
                })
                if(response.ok){
                    const result = await response.json()
                    setAllPosts(result.reverse())
                }
            } catch (error) {
                alert(error)
            } finally{
                setloading(false)
            }
        }

        fetchPosts()
    },[])

    const handleSearchChange = (e) =>{
        setSearchText(e.target.value)
        clearTimeout(searchTimeout)
        setSearchTimeout(
            setTimeout(()=>{
                const searchResults = allPost.filter((item) => item.name.toLowerCase().includes(
                    searchText.toLowerCase()) || item.prompt.toLowerCase
                    ().includes(searchText.toLowerCase()))
                
                 setSearchedResults(searchResults)   
            },500)
        )
        
    }
    return (
    <section className='max-w-7xl mx-auto'>
        <div>
            <h1 className='font-extrabold text-[black] 
            text-[32px]'>圖片總覽</h1>
            <p className='mt-2 text-[#666e75] text-[14px] max-w[500px]'>
            瀏覽藉由 DALL-E AI 所生成的圖片</p>
        </div>
        <div className='mt-16'>
            <FormField
                labelName="搜尋"
                type="text"
                name="text" 
                placeHolder="輸入上傳者名稱或prompt來搜尋"
                value={searchText}
                handleChange={handleSearchChange}
            />
        </div>
        <div className='mt-10'>
            {loading?(
                <div className='flex justify-center items-center'>
                    <Loader/>
                </div>
            ):(
                <>
                    {searchText && (
                        <h2 className='font-medium text-[#666e75]
                        text-xl mb-3'>
                            搜尋結果 <span className='text-
                            [#222328]'>{searchText}</span>
                        </h2>
                    )}
                    <div className='grid lg:grid-cols-4 sm:grid-cols-3 
                    xs:grid-cols-2 grid-cols-1 gap-3'>
                        {searchText?(
                            <RenderCards data={searchedResults}
                            title="查無結果!"/>
                        ):(
                            <RenderCards 
                                data={allPost}
                                title="尚無圖片"/>
                        )}
                    </div>
                </>
            )}
        </div>
    </section>
  )
}

export default Home