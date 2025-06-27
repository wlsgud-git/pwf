interface MediaProps {
  media: any;
  callback?: () => void;
}

export const MyMedia = ({ media, callback }: MediaProps) => {
  // let [mediaType]
  const reset = () => {};
  return (
    <div className="my_media_modal">
      <header className="modal_header">
        <button onClick={reset}>X</button>
      </header>

      <div className="media_lists">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
