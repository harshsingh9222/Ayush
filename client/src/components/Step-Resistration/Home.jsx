import React, { use, useEffect } from 'react'
import { useState, useRef } from 'react'
import axiosInstance from '../../utils/axios.helper'
import Stepper from './Stepper'
import StepperControl from './StepperControl'
import Account from './Steps/RepresentativeInformation'
import Verification from './Steps/Verification'
import BusinessDetails from './Steps/BusinessInformation'
import CompanyDocumentsUpload from './Steps/BusinessDocuments'
import { useDispatch, useSelector } from 'react-redux'
import Completed from './Steps/Completed'
import PersonalDocuments from './Steps/RepresentativeDocuments'
import { addBusiness } from '../../store/businessSlice'
import { addRepresentative } from '../../store/representativeSlice'

const steps = [
    "Personal Information",
    "Personal Documents",
    "Buisness Information",
    "Business Documents",
    "Verification",
]
const Home = () => {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const representativeStatus = useSelector((state) => state.representative.status);
    const representativeData = useSelector((state) => state.representative.representativeData);
    const dispatch = useDispatch();
    const [currStep, setCurrStep] = useState(0);
    const [noOfStepsCompleted, setNoOfStepsCompleted] = useState(0);    
    const formRefs = [
        useRef(null), 
        useRef(null), 
        useRef(null), 
        useRef(null),  
        useRef(null)
    ];

    console.log(authStatus, userData);

    useEffect(() => {
        if (!authStatus) {
            window.location.href = "/login";
        }
        console.log("Representative Status:", representativeStatus);
        if(representativeStatus){
            const stepsCompleted = representativeData?.stepsCompleted;
            // console.log("Steps Completed:", stepsCompleted);

            setCurrStep(stepsCompleted);
            setNoOfStepsCompleted(stepsCompleted);
        }
        else {
            setCurrStep(0);
            setNoOfStepsCompleted(0);
        }

    }, [authStatus, representativeStatus, representativeData, dispatch]);


    const handleClick = async (direction) => {
        if (direction === "Submit") {
            try {
                // Get the current form ref
                const currentForm = formRefs[currStep].current;
                if (currentForm) {
                    console.log("Current Form Ref:", currentForm);
                    await currentForm.submitForm();
                    console.log("Form submitted successfully for step:", currStep);   
                }
            } 
            catch (error) {
                console.error("Form submission error:", error);
            }
        }
        else if(direction === "Next"){
            if(currStep >= noOfStepsCompleted){
                console.log("No more steps to complete. Current step:", currStep, "No of steps completed:", noOfStepsCompleted);
                return;
            }
            setCurrStep(Math.min(steps.length, currStep + 1));
        } 
        else {
            setCurrStep(Math.max(0, currStep - 1));
        }
    };

    const handleFormSubmit = (step) => async(data) => {
        console.log("Form data for step", step, ":", data);
        
        const formData = new FormData();
        
        Object.entries(data).forEach(([key, value]) => {
            console.log(`Processing field: ${key}, Value:`, value);
            if (key.endsWith("File")) {
  
                if (typeof value === "object" && value.length > 0) {
                    console.log(`Appending file for ${key}:`, value[0]);
                    formData.append(key, value[0]);
                }
                else if (typeof value === "string"){
                    console.log(`Appending string for ${key}:`, value);
                    formData.append(key, value);
                }
            } 
            else {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        console.log(`Appending array item for ${key}:`, item);
                        formData.append(`${key}[]`, item); // Use [] to indicate array
                    });
                } else {
                    formData.append(key, value || "");
                }
            }

        });
        
        console.log("FormData prepared for submission:", formData);
        
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        
        try {
            const response = await axiosInstance.post(`/step/step-register/${step}`, formData);
            console.log("Response from server:", response.data);
            
            if(response.data?.business){
                dispatch(addBusiness(response.data.business));
            }
            if(response.data?.representative){
                dispatch(addRepresentative(response.data.representative))
            }
            setCurrStep(Math.min(steps.length , currStep + 1));
       
        } catch (error) {
            console.error("Error during form submission for step", step, ":", error);
            
        }
    };

    const displayStep = (step) => {
        console.log("Displaying step:", step);
        if (step < 0 || step > steps.length) {
            return <div className='text-red-500'>Invalid Step</div>;
        }
        switch (step) {
            case 0: return <Account ref={formRefs[0]} onSubmit={handleFormSubmit(0)} />;
            case 1: return <PersonalDocuments ref={formRefs[1]} onSubmit={handleFormSubmit(1)} />;
            case 2: return <BusinessDetails ref={formRefs[2]} onSubmit={handleFormSubmit(2)} />;
            case 3: return <CompanyDocumentsUpload ref={formRefs[3]} onSubmit={handleFormSubmit(3)} />;
            case 4: return <Verification ref={formRefs[4]} onSubmit={handleFormSubmit(4)} />;
            case 5: return <Completed/>
        }
    };

    

    return (
    <div className='w-5xl mx-auto shadow-xl rounded-2xl pb-2 bg-gray-100 '>
        <div className='container horizontal mt-5'>
            <Stepper 
                steps = {steps}
                currStep = {currStep}
            />
            <div className='my-1 px-4 py-1'> 
                {displayStep(currStep)}
            </div>
        </div>

        <div>
            <StepperControl 
                handleClick = {handleClick}
                currStep = {currStep}
                steps = {steps}
            />
        </div>
    </div>

  )
}

export default Home