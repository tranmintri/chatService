import avatar from "../../assets/2Q.png"

const ConversationInfo = ({ chat }) => {
    return (
        <div>
            <div className="border">
                <p className="fs-4 text-center border-bottom fw-bold m-0">Conversation Info</p>
                <div style={{ maxHeight: '630px' }}>
                    <div className="mb-2 mt-2 border-bottom d-flex justify-content-center align-items-center">
                        <div className="text-center">
                            <img
                                src={`https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c`} // Bạn cần thay đổi đường dẫn hình ảnh tương ứng
                                className="me-2 mb-3 tw-h-20 tw-w-20 tw-rounded-full"
                                // height={80}
                                // width={80}
                                // style={{ borderRadius: '50%' }}
                                alt="Girl Friend"
                            />
                            <p className="fs-6 fw-bold">{chat.name}</p>
                        </div>
                    </div>
                    <div className="mb-2 px-3 fs-5 fw-bold border-bottom">Photos / Videos </div>
                    <div className="mb-2 px-3 fs-5 fw-bold border-bottom">File </div>
                    <div className="mb-2 px-3 fs-5 fw-bold border-bottom">Link </div>
                    <div className="mb-2 px-3 fs-5 fw-bold border-bottom">Privacy settings </div>
                </div>
            </div>
        </div>
    )
}
export default ConversationInfo;