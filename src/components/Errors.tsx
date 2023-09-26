import { FC, ReactElement } from 'react';
import { ErrorsType } from './Disperse';

interface Props {
  errors: ErrorsType [];
}

const Errors: FC<Props> = ({ errors }): ReactElement => {
  return (
    <div className='border border-red-700 rounded-md p-3 flex gap-4'>
      <div className='shrink-0'><img src="/warning.svg" height="30" width="30"/></div>
      <div className='text-left'>
        {
          errors.map(item => {
            return <p className='text-red-700 font-semibold break-all' key={item.message}>{item.message}</p>
          })
        }
      </div>
    </div>
  )
}

export default Errors;
