import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createEventImageThunk, createEventThunk, updateEventThunk } from '../../store/events';
import './EventForm.css';

function EventForm({ formType, event, group }) {
    const history = useHistory();
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user)

    //Halt right there, criminal scum!
    if (!sessionUser) {
        history.push('/')
    };

    if (sessionUser.id !== group.organizerId) {
        history.push('/')
    };

    //Error stuff
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [errors, setErrors] = useState("");
    //New event variables
    const hostId = sessionUser.id;
    const [name, setName] = useState(event.name || "");
    const [type, setType] = useState(event.type || "");
    const [price, setPrice] = useState(event.price || "");
    const [description, setDescription] = useState(event.description || "");
    const [startDate, setStartDate] = useState(event.startDate || "");
    const [endDate, setEndDate] = useState(event.endDate || "");
    const [imgUrl, setImgUrl] = useState("")

    useEffect(() => {
        const imgSuffixes = ['png','jpeg','jpg'];
        const errObj = {};
        if (!name) errObj.name = 'Name is required';
        if (!type) errObj.type = 'Event Type is required';
        if (!price && price !== 0) errObj.price = 'Price is required';
        if (!description || description.length < 30) errObj.description = 'Description must be at least 30 characters long'
        if (!startDate) errObj.startDate = 'Event start is required';
        if (!endDate) errObj.endDate = 'Event end is required';
        if (imgUrl && !imgSuffixes.includes(imgUrl.split('.')[imgUrl.split('.').length - 1])) errObj.img = "Image URL must end in .png, .jpg, or .jpeg";

        if (Object.keys(errObj).length){
            setErrors(errObj);
        } else setErrors({})

    },[name, type, price, description, startDate, endDate, imgUrl])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setHasSubmitted(true);

        if (Object.keys(errors).length) return;

        const newEvent = {
            venueId: null,
            hostId,
            name,
            type,
            price,
            description,
            startDate,
            endDate,
            capacity: 10
        }

        setHasSubmitted(false);

        if (formType === "Create"){
            try {
                const createdEvent = await dispatch(createEventThunk(newEvent, group.id))
                //Check if image was given
                if (imgUrl){
                    const image = {url: imgUrl, preview: true};
                    await dispatch(createEventImageThunk(createdEvent.id, image))
                }

                history.push(`/events/${createdEvent.id}`)
            } catch(e){
                const body = await e.json()
                return setErrors(body.errors);
            }
        } else {
            try{
                const editedEvent = await dispatch(updateEventThunk(newEvent, event.id));
                history.push(`/events/${event.id}`);
            } catch (e){
                const body = await e.json();
                return setErrors(body.errors)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            <div className='event-form-section-one'>
                <h2>{formType === 'Create' ? `Create an event for ${group.name}` : 'Update your event'}</h2>

                <label htmlFor='nameInput'>What is the name of your event?</label>
                <input
                    name="nameInput"
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {hasSubmitted && errors.name && <p className='errors'>{errors.name}</p>}
            </div>
            <div className="event-form-section-two">
                <div>
                    <label htmlFor="typeSelect">Is this an in person or online event?</label>
                    <select name='typeSelect' onChange={e => setType(e.target.value)} value={type}>
                        <option value="" disabled>(select one)</option>
                        <option value="In person" >In person</option>
                        <option value="Online">Online</option>
                    </select>
                {hasSubmitted && errors.type && <p className='errors'>{errors.type}</p>}
                </div>
                <div>
                    <label htmlFor="priceInput">What is the price for your event?</label>
                        <div id="currency-symbol">$</div>
                        <input
                            type="number"
                            step=".01"
                            placeholder="0.00"
                            value={price !== 0 ? price : ''}
                            onChange={(e) => setPrice(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)}
                        />

                </div>
                {hasSubmitted && errors.price && <p className='errors'>{errors.price}</p>}
            </div>
            <div className='event-form-section-three'>
                <div>
                    <label htmlFor='startDateInput'>When does your event start?</label>
                    <input
                        type="text"
                        name='startDateInput'
                        value={startDate}
                        placeholder='MM/DD/YYYY, HH:mm AM'
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                {hasSubmitted && errors.startDate && <p className='errors'>{errors.startDate}</p>}
                <div>
                    <label htmlFor='endDateInput'>When does your event end?</label>
                    <input
                        type="text"
                        name='endDateInput'
                        value={endDate}
                        placeholder='MM/DD/YYYY, HH:mm PM'
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                {hasSubmitted && errors.endDate && <p className='errors'>{errors.endDate}</p>}

            </div>
            <div className='event-form-section-four'>
                <label htmlFor='imageInput'> (Optional) Please add an image url for your event below:</label>
                <input
                    type='text'
                    name='imageInput'
                    value={imgUrl}
                    placeholder='Image URL'
                    onChange={(e) => setImgUrl(e.target.value)}
                />
            </div>
            {hasSubmitted && errors.img && <p className='errors'>{errors.img}</p>}
            <div className='event-form-section-five'>
                <label htmlFor='describeInput'>Please describe your event:</label>
                <textarea
                    name='describeInput'
                    value={description}
                    placeholder='Please include at least 30 characters'
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            {hasSubmitted && errors.description && <p className='errors'>{errors.description}</p>}
            <div className='event-form-section-six'>
                <button id="submit-btn">{formType === 'Create' ? 'Create' : 'Update'} Event</button>
            </div>

        </form>
    )
}

export default EventForm;
