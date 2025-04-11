import React from 'react'
import '../css/Home.css'
import Landpage from './Landpage'

const Home = () => {
  return (<>
    <div className='con-home'>
      <div>
              <p className='wel'>WELCOME TO JIRA</p>
        </div>
      <div className='container'>
            <div className='to1'>
        <span style={{"font-weigth":"bolder","paddingTop":"5px"}}>TO DO 2</span>

          <div className='do1'>
            <p>Engage Jupiter Express for outer solor system travel</p>
            <h5 className='h5'>SPACE TRAVEL PARTNERS</h5>
            <i className="fa-solid fa-square-check" id='check'></i>
            <i className="fa-solid fa-angles-up" id='up'></i>
          </div>
          

          <div className='do1'>
            <p>Create 90 day plans for all department in the Mars Office</p>
            <h5 className='h6'>LOCAL MARS OFFICE</h5>
            <i class="fa-solid fa-circle-up" id='up'></i>
            <i class="fa-solid fa-circle-half-stroke" id='check'></i>
          </div>
        </div>

        <div className='in1'>
        <span style={{"font-weigth":"bolder","paddingTop":"5px"}}>IN PROGRESS 2</span>

          <div className='pro1'>
            <p>Requesting available fligths is now taking 5 seconds</p>
            <h5 className='h7'>SEESPACEEZ PLUS</h5>
            <i className="fa-solid fa-square-check" id='check'></i>
            <i className="fa-solid fa-angles-up" id='up'></i>
          </div>

          <div className='pro1'>
            <p>Create 90 day plans for all department in the Mars Office</p>
            <h5 className='h6'>LOCAL MARS OFFICE</h5>
            <i class="fa-solid fa-circle-up" id='up'></i>
            <i class="fa-solid fa-circle-half-stroke" id='check'></i>
          </div>
        </div>

        <div className='code1'>
        <span style={{"font-weigth":"bolder","paddingTop":"5px"}}>CODE REVIEW 1</span>

          <div className='rev1'>
            <p>Requesting available fligths is now taking 5 seconds</p>
            <h5 className='h7'>SEESPACEEZ PLUS</h5>
            <i className="fa-solid fa-square-check" id='check'></i>
            <i className="fa-solid fa-angles-up" id='up'></i>
          </div>
        </div>

        <div className='done1'>
        <span style={{"font-weigth":"bolder","paddingTop":"5px"}}>DONE 2</span>

          <div className='wn1'>
            <p>Engage Jupiter Express for outer solor system travel</p>
            <h5 className='h5'>SPACE TRAVEL PARTNERS</h5>
            <i className="fa-solid fa-square-check" id='check'></i>
            <i className="fa-solid fa-angles-up" id='up'></i>
          </div>

          <div className='wn1'>
            <p>Create 90 day plans for all department in the Mars Office</p>
            <h5 className='h6'>LOCAL MARS OFFICE</h5>
            <i class="fa-solid fa-circle-up" id='up'></i>
            <i class="fa-solid fa-circle-half-stroke" id='check'></i>
          </div>
          </div>
        </div>
    </div>
    <Landpage/>
    </>
  )
}

export default Home
