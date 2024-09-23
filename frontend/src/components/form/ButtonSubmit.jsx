const ButtonSubmit = ({label, fn}) => {
    return(
        <div className="flex justify-center">
            <button 
                className="bg-transparent hover:bg-gray-900 hover:text-white font-semibold py-2 px-4 border-2 border-gray-800 hover:border-transparent rounded"
                onSubmit={fn}>
                {label}
            </button>
        </div>
    )
}

export default ButtonSubmit;