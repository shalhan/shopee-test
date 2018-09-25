with exchange as 
    (select 
        from_c,to_c, 
        avg(rate) as avg_rate, 
        count(from_c) as total 
        from rates 
        where created_at in ('2017-09-24','2017-09-23','2017-09-22') 
        group by from_c, to_c having count(from_c) >= 3) 
select 
    rates.from_c, 
    rates.to_c, 
    rates.rate, 
    exchange.avg_rate, 
    rates.created_at 
from 
    rates, 
    exchange 
where 
    rates.created_at = '2017-09-24' and 
    rates.from_c = exchange.from_c    
