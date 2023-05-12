import type { Observable } from 'rxjs';
import { NEVER } from 'rxjs';


function fetchAdapter(config: any): Observable<any> {
  return NEVER;
}

export default fetchAdapter;

