export default function ImageFoucsModal(props) {
    return (
        <div className={`modal-overlay ${props.trigger ? 'show' : 'hidden'}`} >
            <div>Imaeg focus</div>
        </div>
    )
}