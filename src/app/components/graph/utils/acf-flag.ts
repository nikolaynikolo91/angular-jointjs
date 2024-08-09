export const ACFlags = {
  // RenderView is used to render the adaptive card inside the foreign object
  RenderView: '@render-view',
  // UpdateView is used to update the size of the foreign object
  // and the color of border
  UpdateView: '@update-view',
  // TransformView is used to position and rotate the view
  TransformView: '@transform-view',
  // MeasureView is used to measure the view and update
  // the size of the model
  MeasureView: '@measure-view'
}; // not used for now test.shape