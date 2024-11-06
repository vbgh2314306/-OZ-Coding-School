import useFetch from "../hook/useFecth";

const Advice = () => {
  const { isLoading, data } = useFetch(
    "https://korean-advice-open-api.vercel.app/api/advice"
  );

  return (
    <>
      {!isLoading && (
        <div className="advice">
          {data.message}
          <br />-{data.author}-
        </div>
      )}
    </>
  );
};

export default Advice;
