using UnityEngine;
using System.Collections;

public class CameraFollow : MonoBehaviour {

	public Transform target;
	public float smoothing = 5f;

	Vector3 offset;

	// Use this for initialization
	void Start () {
	
		//摄像机与目标的相对位置
		offset = transform.position - target.position;
	}
	
	// Update is called once per frame
	void FixedUpdate () {
	
		//保持摄像机与目标物体的相对偏移
		Vector3 targetCamPos = target.position + offset;

		//让摄像机从自己的位置到目标位置进行移动
		transform.position = Vector3.Lerp (transform.position, targetCamPos, smoothing * Time.deltaTime);
	}
}
