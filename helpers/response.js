exports.getResponse = function(code, status, title, data)
{
    //code 1 = success
    //code 0 = failed
    if(code === 1)
    {
        return {
            status: status,
            title: title,
            data: data
        }
    }
    else if(code === 0)
    {
        return {
            error : {
                status: status,
                title: title
            }
        }
    }
}