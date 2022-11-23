const EmptyInitializeComponent = ({callApi, endComponentInit}) =>
{
    return (
        <div>
            <div> Step 1 out of 1</div>
            <button type="button" onClick={ endComponentInit }>Next</button>
        </div>
    );
}

export default EmptyInitializeComponent;
