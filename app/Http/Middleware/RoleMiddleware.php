<?php

namespace App\Http\Middleware;

use Closure;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if($request->header('userFlag')!="admin"){
                $errors=collect(["userFlag"=>"You are not not authorized to perform this request!!"]);
                return response()->json(compact('errors'),405) ; 
        }else{
              return $next($request);
        }
      
    }
}
