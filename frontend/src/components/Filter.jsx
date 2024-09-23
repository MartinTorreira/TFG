export const Filter = () => {
    return(
        <details open class="m-10 max-w-md w-screen overflow-hidden rounded-lg border border-gray-200 open:shadow-lg text-gray-700">
        <summary class="flex cursor-pointer select-none items-center justify-between bg-gray-100 px-5 py-3 lg:hidden">
          <span class="text-sm font-medium"> Toggle Filters </span>
    
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </summary>
    
        <form action="" class="flex border-t border-gray-200 lg:border-t-0">
          <fieldset class="w-full">
            <legend class="block w-full bg-gray-50 px-5 py-3 text-xs font-medium">Type</legend>
    
            <div class="space-y-2 px-5 py-6">
              <div class="flex items-center">
                <input id="New" type="checkbox" name="type[New]" class="h-5 w-5 rounded border-gray-300" checked />
    
                <label for="New" class="ml-3 text-sm font-medium"> New </label>
              </div>
    
              <div class="flex items-center">
                <input id="Used" type="checkbox" name="type[Used]" class="h-5 w-5 rounded border-gray-300" />
    
                <label for="Used" class="ml-3 text-sm font-medium"> Used </label>
              </div>
    
              <div class="flex items-center">
                <input id="Branded" type="checkbox" name="type[Branded]" class="h-5 w-5 rounded border-gray-300" />
    
                <label for="Branded" class="ml-3 text-sm font-medium"> Branded </label>
              </div>
    
              <div class="pt-2">
                <button type="button" class="text-xs text-gray-500 underline">Reset Type</button>
              </div>
            </div>
          </fieldset>
    
          <fieldset class="w-full">
            <legend class="block w-full bg-gray-50 px-5 py-3 text-xs font-medium">Price</legend>
    
            <div class="space-y-2 px-5 py-6">
              <div class="flex items-center">
                <input id="300+" type="radio" name="Price" value="300+" class="h-5 w-5 rounded border-gray-300" />
    
                <label for="300+" class="ml-3 text-sm font-medium"> 300+ </label>
              </div>
    
              <div class="flex items-center">
                <input id="600+" type="radio" name="Price" value="600+" class="h-5 w-5 rounded border-gray-300" />
    
                <label for="600+" class="ml-3 text-sm font-medium"> 600+ </label>
              </div>
    
              <div class="flex items-center">
                <input id="1500+" type="radio" name="Price" value="1500+" class="h-5 w-5 rounded border-gray-300" checked />
    
                <label for="1500+" class="ml-3 text-sm font-medium"> 1500+ </label>
              </div>
    
              <div class="pt-2">
                <button type="button" class="text-xs text-gray-500 underline">Reset Price</button>
              </div>
            </div>
          </fieldset>
        </form>
        <div class="">
          <div class="flex justify-between border-t border-gray-200 px-5 py-3">
            <button name="reset" type="button" class="rounded text-xs font-medium text-gray-600 underline">Reset All</button>
    
            <button name="commit" type="button" class="rounded bg-blue-600 px-5 py-3 text-xs font-medium text-white active:scale-95">Apply Filters</button>
          </div>
        </div>
      </details>
    
    )
}